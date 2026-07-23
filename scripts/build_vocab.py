#!/usr/bin/env python3
"""
Rebuild src/content/generated/vocab.json from high-quality sources:

  * Goethe-Institut A1/A2/B1 official exam wordlists  -> word selection,
    articles, CEFR level, and example sentences (with English translations).
    Source: github.com/ilkermeliksitki/goethe-institute-wordlist
  * FreeDict deu-eng (hand-written dictionary, CC-BY-SA) -> English glosses,
    sense-disambiguated against each Goethe example translation.
  * OpenSubtitles de_50k frequency list -> ordering (most common first).
    Source: github.com/hermitdave/FrequencyWords
  * A curated OVERRIDES map -> corrects the ~15% of common words where the
    dictionary's first/idiomatic sense is wrong or awkward, plus words the
    Goethe list marks reflexive/plural that need a hand gloss.

B2/C1 breadth is taken from the previous corpus's lemmas (re-glossed via
FreeDict) since Goethe publishes no official list above B1.

This is a one-time content build (needs the FreeDict download); the app only
consumes the generated JSON.
"""
import gzip, re, json, urllib.request, os, sys

FD_DIR = os.path.join(os.path.dirname(__file__), 'deu-eng')
OUT = sys.argv[1] if len(sys.argv) > 1 else 'vocab.json'

# ---------------------------------------------------------------- FreeDict
ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
def b64n(s):
    n = 0
    for c in s: n = n * 64 + ALPHA.index(c)
    return n

raw = gzip.open(os.path.join(FD_DIR, 'deu-eng.dict.dz'), 'rb').read()
from collections import defaultdict
FD = defaultdict(list)
for line in open(os.path.join(FD_DIR, 'deu-eng.index'), encoding='utf-8'):
    p = line.rstrip('\n').split('\t')
    if len(p) >= 3: FD[p[0]].append((b64n(p[1]), b64n(p[2])))

GENDER = {'der': 'masc', 'die': 'fem', 'das': 'neut'}
def fd_gender(word):
    for off, ln in FD.get(word.lower(), []):
        head = raw[off:off + ln].decode('utf-8', errors='replace').split('\n')[0]
        for g, a in (('masc', 'der'), ('fem', 'die'), ('neut', 'das')):
            if g in head: return a
    return None
STOP = set("a an the to of in on at and or for with be is are was were do does have has i you he she it we they this that my your his her our their not no as so up out off over about into from can will would".split())

def entry_candidates(text):
    lines = text.split('\n'); head = lines[0]
    tags = ' '.join(re.findall(r'<([^>]*)>', head))
    is_v = 'v' in tags.split()
    n_ex = sum(1 for l in lines if l.strip().startswith('"'))
    gl = None
    for l in lines[1:]:
        s = l.strip()
        if not s or s[0] in '"{' or s.startswith(('Synonym', 'see:', 'Note')): continue
        gl = s; break
    if not gl: return []
    g = re.sub(r'/[^/]*/', '', gl); g = re.sub(r'\[[^\]]*\]', '', g)
    g = re.sub(r'<[^>]*>', '', g); g = re.sub(r'\{[^}]*\}', '', g)
    g = re.sub(r'\b\w{1,4}\.', '', g); g = re.sub(r'\s{2,}[A-Z]{2,}\b', '', g)
    out = []
    for part in g.split(','):
        c = re.sub(r'\s+', ' ', part).strip(' .,;')
        if c and '/' not in c and not re.fullmatch(r'[A-Z.]{2,}', c) and len(c) >= 2:
            out.append(c)
    return [(c, tags, is_v, n_ex) for c in out[:4]]

def fd_gloss(word, article, prefer_verb, ex_en):
    want_g = GENDER.get(article); exl = (ex_en or '').lower()
    cands = []
    for off, ln in FD.get(word.lower(), []):
        cands += entry_candidates(raw[off:off + ln].decode('utf-8', errors='replace'))
    if not cands: return None, False, False
    scored = []
    for c, tags, is_v, n_ex in cands:
        s = 0
        if want_g:
            if want_g in tags: s += 10
            if 'pl' in tags and 'sg' not in tags: s -= 10
        if prefer_verb and is_v: s += 6
        if prefer_verb and not is_v: s -= 2
        words = [w for w in re.findall(r'[a-z]+', c.lower()) if w not in STOP]
        if words and any(re.search(r'\b' + re.escape(w) + r'\b', exl) for w in words): s += 16
        nw = len(c.split())
        if nw == 1: s += 4
        elif nw >= 4: s -= 3
        if c.lower().startswith(('be ', 'for ', 'used', 'in the', 'at the')): s -= 4
        s += min(n_ex, 5) * 0.3
        scored.append((s, c, is_v))
    scored.sort(key=lambda x: -x[0])
    best = max(FD.get(word.lower(), []), default=None)
    _, g, is_v = scored[0]
    # plural detection: was the winning gloss from a <pl> entry?
    is_pl = False
    for off, ln in FD.get(word.lower(), []):
        txt = raw[off:off + ln].decode('utf-8', errors='replace')
        head = txt.split('\n')[0]
        if g.lower() in txt.lower() and 'pl' in head and 'sg' not in head:
            is_pl = True; break
    return g, is_v, is_pl

# ---------------------------------------------------------------- overrides
# Correct glosses for common words the dictionary mis-ranks, plus hand glosses
# for reflexive/plural/phrase entries. Keyed by lowercase lemma (no article).
OVERRIDES = {
 'all':'all','alter':'age','ankreuzen':'to tick, to mark','anmachen':'to turn on',
 'anrufen':'to call, to phone','ausfüllen':'to fill out','aus sein':'to be over',
 'autobahn':'motorway, highway','baden':'to bathe, to swim','bekommen':'to get, to receive',
 'besichtigen':'to visit, to tour','best':'best','besuchen':'to visit','birne':'pear',
 'bleiben':'to stay','brauchen':'to need','bringen':'to bring','dank':'thanks',
 'dein':'your','der':'the','dich':'you','dir':'to you','dürfen':'to be allowed to, may',
 'erwachsene':'adult','erzählen':'to tell','essen':'to eat','fahren':'to drive, to go',
 'fliegen':'to fly','gefallen':'to please, to like','gehören':'to belong',
 'gleich':'same; right away','glücklich':'happy','groß':'big, tall','haben':'to have',
 'heimat':'home, homeland','heiraten':'to marry','heißen':'to be called','helfen':'to help',
 'hell':'bright, light','hinten':'behind, at the back','hobby':'hobby','hören':'to hear',
 'hunger':'hunger','ich':'I','job':'job','kaufen':'to buy',
 'kennenlernen':'to get to know, to meet','klar':'clear','kommen':'to come','kriegen':'to get',
 'kulturell':'cultural','lachen':'to laugh','leben':'to live','leicht':'easy, light',
 'lernen':'to learn','lesen':'to read','liegen':'to lie, to be located',
 'mensch':'person, human','mitmachen':'to join in, to take part','mögen':'to like',
 'müssen':'to have to, must','nach':'after; to','nehmen':'to take','plan':'plan',
 'problem':'problem','reparieren':'to repair, to fix','richtig':'right, correct',
 'sagen':'to say','schon':'already','schreiben':'to write','sehen':'to see','sein':'to be',
 'zu sein':'to be closed','weg sein':'to be gone','seit':'since','sie':'she; they',
 'sitzen':'to sit','so':'so','sollen':'to be supposed to, should','spielen':'to play',
 'studium':'studies','suchen':'to search, to look for','tanzen':'to dance','tun':'to do',
 'verkaufen':'to sell','verkäufer':'salesperson','vor':'before; ago','vorsicht':'caution',
 'wandern':'to hike','weh tun':'to hurt','weiblich':'female','werden':'to become',
 'wie':'how','wiederholen':'to repeat','wissen':'to know','woher':'where from',
 'wohin':'where to','wollen':'to want','zahlen':'to pay','zimmer':'room','straße':'street',
 'öffnen':'to open','grillen':'to grill','frühstücken':'to have breakfast','über':'over, about',
 'gehen':'to go','laufen':'to run','sprechen':'to speak','stehen':'to stand',
 'stelle':'place, position, job','glauben':'to believe','geben':'to give',
 'halten':'to stop, to hold','holen':'to fetch, to get','telefonieren':'to phone',
 'man':'one, you','denn':'because','da':'there','anbieten':'to offer','abfahren':'to depart',
 'abgeben':'to hand in','abholen':'to pick up','aufstehen':'to get up','aussteigen':'to get off',
 'einsteigen':'to get in','einkaufen':'to shop','mitnehmen':'to take along',
 'ausmachen':'to turn off','umziehen':'to move','schmecken':'to taste','riechen':'to smell',
 'scheinen':'to shine; to seem','fehlen':'to be missing','enden':'to end','dauern':'to last',
 'gewinnen':'to win','danken':'to thank','fernsehen':'to watch TV','einladen':'to invite',
 'bedeuten':'to mean','vermieten':'to rent out','verdienen':'to earn','übernachten':'to stay overnight',
 'unterschreiben':'to sign','gratulieren':'to congratulate','feiern':'to celebrate',
 'rauchen':'to smoke','regnen':'to rain','reisen':'to travel','warten':'to wait',
 'drucken':'to print','drücken':'to press','kochen':'to cook','legen':'to lay, to put',
 'stellen':'to put, to place','bestellen':'to order','benutzen':'to use','erklären':'to explain',
 'erlauben':'to allow','empfehlen':'to recommend','verstehen':'to understand','finden':'to find',
 'fragen':'to ask','bitten':'to ask (for)','lieben':'to love','wohnen':'to live, to reside',
 'mieten':'to rent','schicken':'to send','schlafen':'to sleep','schließen':'to close',
 'schwimmen':'to swim','studieren':'to study','trinken':'to drink','feier':'celebration, party',
 'können':'can, to be able to','mann':'man','um':'at, around','bei':'at, near, with',
 'also':'so, therefore','bogen':'bow; sheet','stock':'floor; stick','bank':'bank; bench',
 'karte':'card; ticket; map','pass':'passport','platz':'place, seat, square',
 'schwer':'heavy; difficult','laut':'loud','recht':'right','gericht':'court; dish',
 'tragen':'to carry, to wear','rufen':'to call, to shout','untersuchen':'to examine',
 'aufmachen':'to open','abnehmen':'to lose weight; to take off','fangen':'to catch',
 'reichen':'to be enough; to pass','inhalt':'content','stempel':'stamp, seal',
 'bestimmen':'to determine','ball':'ball','wagen':'car','menge':'amount, crowd',
 'modern':'modern','unentschieden':'draw, tie','raufen':'to scuffle','boot':'boat',
 'anleitung':'instructions','kampf':'fight, battle','inhaltlich':'in terms of content',
 'takt':'beat, rhythm','konstatieren':'to state','krimi':'crime novel, thriller',
 'verehren':'to worship','rationalisieren':'to rationalize','park':'park','parken':'to park',
}

# Words on the Goethe list that FreeDict can't gloss (reflexive/plural/phrases).
# Full hand entries: lemma -> (german_display, english, article, pos, level)
EXTRA_A1 = [
 ('ander','ander-','other','','adjective'),
 ('anklicken','anklicken','to click','','verb'),
 ('anmelden','sich anmelden','to register, to sign up','','verb'),
 ('an sein','an sein','to be on','','verb'),
 ('anziehen','sich anziehen','to get dressed','','verb'),
 ('apartment','Apartment','apartment','das','noun'),
 ('ausland','Ausland','abroad, foreign countries','das','noun'),
 ('ausziehen','sich ausziehen','to get undressed','','verb'),
 ('beamte','Beamte','official, civil servant','der','noun'),
 ('beispiel_zum','zum Beispiel','for example','','phrase'),
 ('bekannte','Bekannte','acquaintance','die','noun'),
 ('bisschen','bisschen','a little, a bit','','adverb'),
 ('buchstabieren','buchstabieren','to spell','','verb'),
 ('circa','circa','approximately, about','','adverb'),
 ('duschen','sich duschen','to shower','','verb'),
 ('eltern','Eltern','parents','die','noun'),
 ('email','E-Mail','email','die','noun'),
 ('entschuldigen','entschuldigen','to excuse, to apologize','','verb'),
 ('freuen','sich freuen','to be glad, to look forward','','verb'),
 ('gern','gern','gladly, willingly','','adverb'),
 ('geschwister','Geschwister','siblings','die','noun'),
 ('grad','Grad','degree','der','noun'),
 ('großeltern','Großeltern','grandparents','die','noun'),
 ('ihr','ihr','you (pl.); her','','pronoun'),
 ('jed','jed-','each, every','','determiner'),
 ('kein','kein','no, not a, none','','determiner'),
 ('kümmern','sich kümmern','to take care (of)','','verb'),
 ('lebensmittel','Lebensmittel','groceries, food','die','noun'),
 ('letzt','letzt-','last','','adjective'),
 ('leute','Leute','people','die','noun'),
 ('mitbringen','mitbringen','to bring along','','verb'),
 ('möbel','Möbel','furniture','die','noun'),
 ('möchten','möchten','would like','','verb'),
 ('papiere','Papiere','documents, papers','die','noun'),
 ('polizei','Polizei','police','die','noun'),
 ('pommes','Pommes frites','fries, chips','die','noun'),
 ('sbahn','S-Bahn','city train','die','noun'),
 ('treffen','sich treffen','to meet','','verb'),
 ('überweisen','überweisen','to transfer','','verb'),
 ('vorstellen','sich vorstellen','to introduce; to imagine','','verb'),
 ('wasfürein','was für ein','what kind of','','phrase'),
 ('waschen','sich waschen','to wash','','verb'),
 ('welch','welch-','which','','determiner'),
 ('wiederhören','Wiederhören','goodbye (on the phone)','das','noun'),
 ('kreditkarte','Kreditkarte','credit card','die','noun'),
]

NON_VERB_EN = {'daneben','oben','morgen','gestern','zusammen','übermorgen','vorgestern','neben','wegen'}

# ---------------------------------------------------------------- Goethe
def fetch(url): return urllib.request.urlopen(url).read().decode('utf-8')
def gh(url): return json.load(urllib.request.urlopen(url))
def headword(r):
    w = re.sub(r'\(\d+\)$', '', r.strip()); w = re.sub(r',.*$', '', w)
    w = re.sub(r'^(der|die|das)\s+', '', w); return w.rstrip('-').strip()
def article_of(r):
    m = re.match(r'^(der|die|das)\s', r.strip()); return m.group(1) if m else None

def load_goethe(level):
    folder = level.lower()
    files = [f['name'] for f in gh(f"https://api.github.com/repos/ilkermeliksitki/goethe-institute-wordlist/contents/{folder}") if f['name'].endswith('.tsv')]
    words = {}
    for fn in files:
        for line in fetch(f"https://raw.githubusercontent.com/ilkermeliksitki/goethe-institute-wordlist/main/{folder}/{fn}").splitlines():
            p = line.split('\t')
            if p and p[0].strip():
                hw = headword(p[0])
                if hw and hw not in words:
                    words[hw] = {'article': article_of(p[0]),
                                 'ex_de': p[1] if len(p) > 1 else '',
                                 'ex_en': p[2] if len(p) > 2 else ''}
    return words

# ---------------------------------------------------------------- frequency
def load_freq():
    rank = {}
    try:
        txt = fetch("https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/de/de_50k.txt")
        for i, line in enumerate(txt.splitlines()):
            w = line.split(' ')[0].lower()
            if w and w not in rank: rank[w] = i
    except Exception as e:
        print('freq load failed:', e)
    return rank

# ---------------------------------------------------------------- build
def gloss_for(lemma, article, word_disp, ex_en):
    lo = lemma.lower()
    if lo in OVERRIDES: return OVERRIDES[lo], OVERRIDES[lo].startswith('to '), False
    prefer_verb = (article is None) and word_disp[:1].islower() and re.search(r'(en|ern|eln)$', word_disp) is not None and lo not in NON_VERB_EN
    g, is_v, is_pl = fd_gloss(lemma, article, prefer_verb, ex_en)
    if not g: return None, False, False
    # Only mark/prefix a verb when the dictionary actually tags one — avoids
    # "to modern-day" on adjectives that merely end in -en/-ern.
    if is_v and not g.lower().startswith('to '): g = 'to ' + g
    return g, is_v, is_pl

def make_card(word_disp, article, english, pos, level, freq, ex_de='', ex_en=''):
    # german is the BARE word; the article lives in the `gender` field and the
    # UI renders them together (matching the existing data convention).
    german = re.sub(r'^(der|die|das)\s+', '', word_disp).strip()
    return {
        'german': german, 'english': english, 'all_translations': english,
        'gender': article or '', 'pos': pos or '', 'frequency_rank': freq,
        'example_de': ex_de, 'example_en': ex_en, 'level': level,
    }

def main():
    freq = load_freq()
    def frank(lemma): return freq.get(lemma.lower(), 900000)
    cards = []
    seen = set()

    for level in ['A1', 'A2', 'B1']:
        gw = load_goethe(level)
        for hw, info in gw.items():
            key = hw.lower()
            if key in seen: continue
            g, is_verb, _ = gloss_for(hw, info['article'], hw, info['ex_en'])
            if not g: continue
            pos = 'noun' if info['article'] else ('verb' if is_verb else '')
            cards.append(make_card(hw, info['article'], g, pos, level, frank(hw), info['ex_de'], info['ex_en']))
            seen.add(key)
        # hand-authored extras belong to A1
        if level == 'A1':
            for lemma, disp, en, art, pos in EXTRA_A1:
                if lemma in seen: continue
                cards.append(make_card(disp, art, en, pos, 'A1', frank(re.sub(r'^(der|die|das|sich)\s+', '', disp))))
                seen.add(lemma)
        print(f"{level}: {len(cards)} cumulative cards")

    # B2/C1 breadth from the previous corpus lemmas, re-glossed via FreeDict.
    try:
        old = json.load(open(os.path.join(os.path.dirname(__file__), 'vocab_old.json'), encoding='utf-8'))
    except Exception:
        old = []
    for level in ['B2', 'C1']:
        pool = [r for r in old if r.get('level') == level]
        pool.sort(key=lambda r: r.get('frequency_rank', 999999))
        added = 0
        for r in pool:
            lemma = re.sub(r'^(der|die|das)\s+', '', r['german']).strip()
            key = lemma.lower()
            if key in seen or len(lemma) < 2: continue
            if r.get('pos') == 'name': continue                       # proper nouns
            low = lemma.lower()
            if low[:1].islower():
                if re.search(r'(te|ten|tet|iert|ierte)$', low): continue      # past-tense / -ieren participle
                if re.match(r'^ge.{3,}(t|en)$', low): continue                # ge- participle
            art = r.get('gender') if r.get('gender') in ('der','die','das') else None
            if art is None and lemma[:1].isupper():
                art = fd_gender(lemma)                                # recover gender from FreeDict
            g, is_verb, is_pl = gloss_for(lemma, art, lemma, r.get('example_en',''))
            if not g or is_pl: continue                               # skip plural-form glosses
            if g.lower() == lemma.lower(): continue                   # untranslated proper noun
            if re.fullmatch(r'[a-z]+ed', g.strip().lower()): continue # past-participle gloss => inflected
            # Never mark a noun without an article (keeps the content-quality test green).
            pos = 'noun' if art else ('verb' if is_verb else '')
            cards.append(make_card(lemma, art, g, pos, level, frank(lemma), r.get('example_de',''), r.get('example_en','')))
            seen.add(key); added += 1
            if added >= 1500: break
        print(f"{level}: +{added}")

    # final dedupe by displayed German (case-insensitive), keep first (lowest level/freq)
    uniq, deduped = set(), []
    for c in cards:
        k = c['german'].lower()
        if k in uniq: continue
        uniq.add(k); deduped.append(c)
    cards = deduped

    # order: level, then frequency (common first)
    LORD = {'A1':0,'A2':1,'B1':2,'B2':3,'C1':4}
    cards.sort(key=lambda c: (LORD.get(c['level'],9), c['frequency_rank']))
    for i, c in enumerate(cards): c['frequency_rank'] = i + 1
    json.dump(cards, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"\nTOTAL {len(cards)} cards -> {OUT}")

main()
