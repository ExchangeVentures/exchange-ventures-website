// ---------------------------------------------------------------------------
// All site copy lives here. Keep it short: every line on this page has to earn
// its place, and most lines cut from a landing page are not missed.
// ---------------------------------------------------------------------------

export const brand = {
  name: 'Exchange Ventures',
  wordmark: 'Exchange Ventures',
  tagline: 'Strategy and capital for small businesses',
  email: 'hello@xchngventure.com',
  location: 'Calgary, AB',
}

export const nav = [
  { label: 'What we do', href: '#practices' },
  { label: 'How', href: '#approach' },
  { label: 'Snapshot', href: '#snapshot' },
  { label: 'Fees', href: '#fees' },
]

export const hero = {
  est: 'Est. 2026',
  // The whole hero. One line saying what we do, nothing else.
  line: 'Strategy and capital for small businesses.',
  cta: { label: 'Run a Snapshot', href: '#snapshot' },
}

// The mono strip under the hero. Data, not prose.
export const criteria = [
  'Advisory from $4,800',
  'Capital: $150k to $1.5M revenue',
  'No brokers, no listing fees',
]

export const facts = [
  { value: '10', unit: 'days', label: 'To a written plan' },
  { value: '90', unit: 'days', label: 'Running the plan' },
  { value: '<10', unit: 'people', label: 'Who we work with' },
]

export const practices = [
  {
    id: 'advisory',
    tag: 'Practice 01',
    name: 'Advisory',
    line: 'Strategy for expansion and improvement.',
    points: [
      { t: 'Expansion', d: 'A second location, a new line, a first real hire.' },
      { t: 'Improvement', d: 'Pricing, margin, and cutting the work that loses money.' },
      { t: 'Capacity', d: 'Getting the business to run without you in everything.' },
    ],
    cta: { label: 'Start with a Snapshot', href: '#snapshot' },
  },
  {
    id: 'capital',
    tag: 'Practice 02',
    name: 'Capital',
    line: 'Micro private equity, at a size nobody covers.',
    points: [
      { t: 'What we buy', d: '$150k to $1.5M revenue. Profitable, boring, stable.' },
      { t: 'How we structure it', d: 'Full, majority or minority. Seller financing is normal.' },
      { t: 'What happens after', d: 'You stay on or you hand over. Both are fine.' },
    ],
    cta: { label: 'Talk about selling', href: '#contact' },
  },
]

export const approach = {
  label: 'How we work',
  headline: 'Four steps. Ten days. Then ninety.',
  steps: [
    { n: '01', t: 'Map', dur: 'Days 1 to 3', d: 'Where the money comes from, and where your week goes.', out: 'A one-page map' },
    { n: '02', t: 'Choose', dur: 'Days 4 to 6', d: 'The live options side by side, with what each one costs. You pick one.', out: 'One direction, in writing' },
    { n: '03', t: 'Build the ninety', dur: 'Days 7 to 10', d: 'Three thirty-day blocks. Each with one objective and one number.', out: 'A plan sized to your hours' },
    { n: '04', t: 'Run it together', dur: 'Days 11 to 90', d: 'Fortnightly sessions. We fix what is stuck and cut what is not earning its place.', out: 'Six sessions' },
  ],
}

export const engagements = [
  {
    id: 'snapshot',
    name: 'Snapshot',
    price: 'Free',
    priceNote: 'ten minutes',
    summary: 'A written read on what is holding you back.',
    includes: ['The binding constraint, named', 'Three moves, ranked', 'A ninety-day outline'],
    cta: { label: 'Run it now', href: '#snapshot' },
    featured: false,
  },
  {
    id: 'ninety',
    name: 'The Ninety',
    price: '$4,800',
    priceNote: 'fixed fee',
    summary: 'Ten days to build the plan. Eighty to run it.',
    includes: ['Diagnostic and business map', 'A written ninety-day plan', 'Six working sessions'],
    cta: { label: 'Start a Ninety', href: '#contact' },
    featured: true,
  },
  {
    id: 'advisor',
    name: 'Standing Advisor',
    price: '$950',
    priceNote: 'per month',
    summary: 'A second brain on the decisions that matter.',
    includes: ['Two sessions a month', 'Async answers inside a day', 'Any deal reviewed before you sign'],
    cta: { label: 'Enquire', href: '#contact' },
    featured: false,
  },
  {
    id: 'capital',
    name: 'Capital',
    price: 'No fee',
    priceNote: 'we are the buyer',
    summary: 'Selling or stepping back. A conversation, not a pitch.',
    includes: ['An honest read on value', 'Full, majority or minority', 'A handover paced to suit you'],
    cta: { label: 'Start a conversation', href: '#contact' },
    featured: false,
  },
]

export const ai = {
  label: 'AI-assisted, human-decided',
  headline: 'The Strategy Snapshot',
  lead: 'Six questions. A written brief in about twenty seconds. A person reviews anything that turns into work.',
  disclaimer: 'A first-pass read from six answers. Not financial, legal or tax advice.',
}

export const faqs = [
  {
    q: 'What counts as a small business?',
    a: 'Fewer than ten people, usually under two million in revenue. Above about fifteen people you want a different kind of adviser, and we will say so rather than take the work.',
  },
  {
    q: 'Would you buy a business you advise?',
    a: 'Not while we are advising it. If a conversation moves from advisory to capital we say so, stop the advisory work, and you are free to bring in your own adviser. Nobody should negotiate with their own consultant.',
  },
  {
    q: 'What does the AI actually do?',
    a: 'The first pass. It reads your answers and drafts the brief. A person reviews anything that becomes an engagement.',
  },
  {
    q: 'What do you pay, and how?',
    a: 'It depends on cash flow, owner dependency and how stable the last two years look. You get a range and the reasoning early, not after weeks of diligence. Seller financing is normal at this size.',
  },
]

export const cta = {
  label: 'Start here',
  headline: 'Twenty minutes, and you will know if we are useful.',
  lead: 'Run the Snapshot, or just tell us what is going on.',
}
