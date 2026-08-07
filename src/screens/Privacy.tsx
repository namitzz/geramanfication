import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Stagger, Item } from '../motion/Reveal';
import { analyticsEnabled } from '../utils/analytics';
import { monitoringEnabled } from '../utils/monitoring';
import { APP_NAME } from '../brand';

// Where people can reach you. Swap for a dedicated support address if you set
// one up; kept off a personal inbox by pointing at the public repo for now.
const CONTACT_URL = 'https://github.com/namitzz/Tovo/issues';
const LAST_UPDATED = 'August 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Item>
      <h2 className="mb-2 text-[17px] font-semibold">{title}</h2>
      <div className="text-muted space-y-2 text-[14px] leading-relaxed">{children}</div>
    </Item>
  );
}

export default function Privacy() {
  const navigate = useNavigate();
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
        <h1 className="display text-[26px]">Privacy</h1>
        <p className="mono text-faint mt-1 text-[12px]">Last updated {LAST_UPDATED}</p>
      </Item>

      <Section title="The short version">
        <p>
          {APP_NAME} is built to be private by default. Your learning progress lives on your own
          device, not on our servers. There are no accounts, no ad trackers, and we never sell your
          data.
        </p>
      </Section>

      <Section title="What’s stored on your device">
        <p>
          Everything you do — your streak, XP, mastered words, mistakes, and settings — is saved in
          your browser’s local storage. It stays on this device and is never uploaded unless you
          explicitly export it.
        </p>
        <p>
          You’re in full control: <strong>You → Your data</strong> lets you export a backup file,
          restore one, or reset everything permanently.
        </p>
      </Section>

      {analyticsEnabled() ? (
        <Section title="Anonymous usage analytics">
          <p>
            We use privacy-friendly, cookieless analytics to understand which features are used and
            where the app can improve. It records aggregate events only — no cookies, no
            cross-site tracking, and nothing that identifies you personally. Because no personal
            data is collected, no consent banner is required.
          </p>
        </Section>
      ) : (
        <Section title="Usage analytics">
          <p>This build does not use any analytics or usage tracking.</p>
        </Section>
      )}

      {monitoringEnabled() ? (
        <Section title="Crash reports">
          <p>
            When the app hits an unexpected error, an anonymous crash report is sent so we can fix
            it. Reports contain the error and a technical breadcrumb trail — never your IP address
            or your learning data.
          </p>
        </Section>
      ) : null}

      <Section title="Children">
        <p>
          {APP_NAME} is a general-audience learning app and does not knowingly collect personal
          information from anyone, including children.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If this policy changes, the “last updated” date above will change with it. Material
          changes will be noted in the app.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy? Reach out via{' '}
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="underline"
            style={{ color: 'var(--accent)' }}
          >
            our GitHub project
          </a>
          .
        </p>
      </Section>
    </Stagger>
  );
}
