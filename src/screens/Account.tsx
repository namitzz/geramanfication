import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, CloudOff, RefreshCw, LogOut, Mail } from 'lucide-react';
import { Stagger, Item } from '../motion/Reveal';
import { syncEnabled } from '../lib/supabase';
import { useSession } from '../lib/useSession';
import { signInWithEmail, signOut } from '../lib/auth';
import { syncNow } from '../lib/sync';

export default function Account() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const enabled = syncEnabled();

  const sendLink = async () => {
    if (!email.trim()) return;
    setBusy(true);
    setMsg('');
    const res = await signInWithEmail(email);
    setMsg(res.message);
    setBusy(false);
  };

  const doSync = async () => {
    if (!session) return;
    setBusy(true);
    setMsg('');
    const ok = await syncNow(session.user.id);
    setMsg(ok ? 'Synced just now.' : 'Sync failed — check your connection.');
    setBusy(false);
  };

  const doSignOut = async () => {
    setBusy(true);
    await signOut();
    setMsg('Signed out. Your progress stays on this device.');
    setBusy(false);
  };

  return (
    <Stagger className="space-y-6">
      <Item>
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="text-faint mb-4 flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="display text-[26px]">Account &amp; sync</h1>
        <p className="text-muted mt-1 text-sm">
          Optional. Sign in to back up your progress and continue on another device. Your data stays
          on this device either way.
        </p>
      </Item>

      {!enabled ? (
        <Item>
          <div className="card flex items-center gap-3 px-5 py-4">
            <CloudOff size={20} className="text-faint" />
            <p className="text-muted text-sm">Cloud sync isn’t enabled in this build yet.</p>
          </div>
        </Item>
      ) : loading ? (
        <Item>
          <p className="text-faint text-sm">Loading…</p>
        </Item>
      ) : session ? (
        <>
          <Item>
            <div className="card flex items-center gap-3 px-5 py-4">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{ background: 'var(--good-soft)', color: 'var(--good)' }}
              >
                <Cloud size={18} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{session.user.email}</p>
                <p className="text-faint text-[13px]">Synced to the cloud</p>
              </div>
            </div>
          </Item>
          <Item>
            <div className="space-y-3">
              <button
                onClick={doSync}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3 font-semibold text-accent-ink disabled:opacity-60"
              >
                <RefreshCw size={16} /> Sync now
              </button>
              <button
                onClick={doSignOut}
                disabled={busy}
                className="text-muted flex w-full items-center justify-center gap-2 py-2 text-sm font-medium"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </Item>
        </>
      ) : (
        <>
          <Item>
            <div className="card space-y-3 px-5 py-5">
              <label htmlFor="email" className="text-muted flex items-center gap-2 text-sm">
                <Mail size={16} /> Email address
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass w-full rounded-2xl px-4 py-3 outline-none placeholder:text-faint"
              />
              <button
                onClick={sendLink}
                disabled={busy || !email.trim()}
                className="w-full rounded-2xl bg-accent py-3 font-semibold text-accent-ink disabled:opacity-60"
              >
                {busy ? 'Sending…' : 'Send magic link'}
              </button>
              <p className="text-faint text-[13px]">
                We’ll email you a one-tap sign-in link. No password required.
              </p>
            </div>
          </Item>
        </>
      )}

      {msg && (
        <Item>
          <p className="text-muted px-1 text-[13px]">{msg}</p>
        </Item>
      )}
    </Stagger>
  );
}
