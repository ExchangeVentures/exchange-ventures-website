// ---------------------------------------------------------------------------
// Local strategy engine.
//
// This runs entirely in the browser and produces the Snapshot brief when no
// model endpoint is configured (see lib/ai.js). It is deterministic: the same
// answers always give the same brief. Treat it as the house point of view,
// written down. The model, when wired up, is given the same point of view as
// its system prompt.
// ---------------------------------------------------------------------------

export const questions = [
  {
    id: 'sector',
    label: 'What kind of business is it?',
    help: 'Pick the closest. It changes which levers we look at first.',
    type: 'choice',
    options: [
      { value: 'trades', label: 'Trades & home services' },
      { value: 'retail', label: 'Independent retail' },
      { value: 'food', label: 'Café, kitchen or hospitality' },
      { value: 'creative', label: 'Design, creative or agency' },
      { value: 'practice', label: 'Clinic, practice or professional services' },
      { value: 'ecom', label: 'E-commerce or product' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'size',
    label: 'How many people, including you?',
    help: 'Headcount is the single best predictor of which ceiling you are hitting.',
    type: 'choice',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: 'micro', label: '2 to 3' },
      { value: 'small', label: '4 to 6' },
      { value: 'ten', label: '7 to 10' },
    ],
  },
  {
    id: 'revenue',
    label: 'Roughly what does the business turn over a year?',
    help: 'An estimate is fine. Nothing here is stored unless you ask us to send it.',
    type: 'choice',
    options: [
      { value: 'pre', label: 'Under $100k' },
      { value: 'early', label: '$100k to $350k' },
      { value: 'mid', label: '$350k to $750k' },
      { value: 'upper', label: '$750k to $2M' },
      { value: 'above', label: 'Over $2M' },
    ],
  },
  {
    id: 'constraint',
    label: 'What is most in the way right now?',
    help: 'Choose the one that would change the most if it disappeared tomorrow.',
    type: 'choice',
    options: [
      { value: 'leads', label: 'Not enough new customers coming in' },
      { value: 'capacity', label: 'Too busy delivering to work on anything else' },
      { value: 'pricing', label: 'Busy, but the money is not there' },
      { value: 'concentration', label: 'Too dependent on one client or channel' },
      { value: 'owner', label: 'Everything runs through me' },
      { value: 'visibility', label: 'I cannot tell what is actually working' },
    ],
  },
  {
    id: 'goal',
    label: 'Twelve months out, what does a good outcome look like?',
    type: 'choice',
    options: [
      { value: 'profit', label: 'Same size, materially more profit' },
      { value: 'grow', label: 'Meaningfully bigger revenue' },
      { value: 'hours', label: 'The same business, half the hours' },
      { value: 'delegate', label: 'A team that runs without me in everything' },
      { value: 'exit', label: 'Positioned to sell or hand over' },
    ],
  },
  {
    id: 'hours',
    label: 'Realistically, how many hours a week can you give to changing things?',
    help: 'Be honest. Every plan we write is sized to this number.',
    type: 'choice',
    options: [
      { value: 'tiny', label: 'Under 2 hours' },
      { value: 'some', label: '2 to 5 hours' },
      { value: 'real', label: '5 to 10 hours' },
      { value: 'lots', label: 'More than 10 hours' },
    ],
  },
]

const SECTOR = {
  trades:   { noun: 'trade business', unit: 'job',       demand: 'local search and referral', margin: 'quoted job margin' },
  retail:   { noun: 'shop',            unit: 'basket',    demand: 'footfall and repeat visits', margin: 'gross margin per square foot' },
  food:     { noun: 'kitchen',         unit: 'cover',     demand: 'local repeat custom',        margin: 'margin per cover' },
  creative: { noun: 'studio',          unit: 'project',   demand: 'referral and reputation',    margin: 'margin per project' },
  practice: { noun: 'practice',        unit: 'appointment', demand: 'referral and search',      margin: 'margin per hour of clinician time' },
  ecom:     { noun: 'product business',unit: 'order',     demand: 'paid and organic acquisition', margin: 'contribution margin per order' },
  other:    { noun: 'business',        unit: 'engagement',demand: 'your main acquisition channel', margin: 'margin per engagement' },
}

const SIZE = {
  solo:  { label: 'a business of one', ceiling: 'your own hours', team: 'no team to absorb anything' },
  micro: { label: 'a two-to-three person business', ceiling: 'the owner plus one or two pairs of hands', team: 'a team too small to specialise' },
  small: { label: 'a four-to-six person business', ceiling: 'the first real management layer', team: 'a team that needs process but has none' },
  ten:   { label: 'a seven-to-ten person business', ceiling: 'the point where the owner stops being able to hold it all in their head', team: 'a team that now needs someone other than you to lead it' },
}

const CONSTRAINT = {
  leads: {
    name: 'Demand generation',
    why:
      'You have capacity you are not selling. In a business this size that is rarely a marketing-budget problem. It is almost always that no single channel has ever been given twelve uninterrupted weeks of attention.',
    evidence:
      'Look for this: three or four half-built channels, none of which you could describe the economics of.',
  },
  capacity: {
    name: 'Delivery capacity',
    why:
      'Demand is not your problem; the ability to convert it into delivered, paid work is. Every hour you spend inside delivery is an hour not spent on the thing that would remove the ceiling.',
    evidence:
      'Look for this: a waitlist or a lead time you are quietly embarrassed by, and no price increase in over a year.',
  },
  pricing: {
    name: 'Unit economics',
    why:
      'The work is selling and the business is still tight, which means the price does not cover the true cost of delivering it. This is the most common and the most fixable constraint we see.',
    evidence:
      'Look for this: prices set by looking at competitors, discounts given verbally, and no idea which customer type is your worst.',
  },
  concentration: {
    name: 'Concentration risk',
    why:
      'One client, one channel or one referrer is carrying too much of the business. It is not a problem until it is, and then it is the only problem.',
    evidence:
      'Look for this: a single relationship above roughly a quarter of revenue, or an acquisition channel you do not own.',
  },
  owner: {
    name: 'Owner dependency',
    why:
      'The business cannot produce output without you in the room. That caps revenue at your stamina, and it is also the single largest discount on the value of the business if you ever sell.',
    evidence:
      'Look for this: nothing written down, quotes only you can price, and a holiday that requires the phone.',
  },
  visibility: {
    name: 'Decision visibility',
    why:
      'You are flying on feel. Not fatal at this size, but it means every decision costs more deliberation than it should, and you cannot tell a good month from a lucky one.',
    evidence:
      'Look for this: a bookkeeper who reports history, no weekly number, and marketing spend you cannot attribute.',
  },
}

const MOVES = {
  leads: [
    { title: 'Pick one channel and starve the rest', detail: (s) => `Choose the single channel closest to how your customers already find ${s.demand.split(' and ')[0]} work, and commit twelve weeks to it. Kill or pause everything else for that period, including the ones that feel free.`, effort: 'Low', payback: '6 to 12 weeks' },
    { title: 'Rebuild the first sixty seconds', detail: () => 'Most lost enquiries are lost before anyone talks to you. Rewrite the top of your site, your listing and your voicemail so that a stranger can tell in one line who you are for and what it costs to start.', effort: 'Low', payback: '2 to 4 weeks' },
    { title: 'Instrument the enquiry path', detail: () => 'Log every enquiry, its source, and whether it closed, in one sheet. Four weeks of this beats any analytics tool at this size and turns the channel decision from an argument into arithmetic.', effort: 'Low', payback: '4 weeks' },
    { title: 'Build one repeatable referral ask', detail: () => 'Write the specific sentence, and the specific moment in the job, when you ask. Undocumented referral is not a channel, it is weather.', effort: 'Medium', payback: '8 to 12 weeks' },
  ],
  capacity: [
    { title: 'Raise price before you add people', detail: () => 'A visible lead time is a market signal that you are underpriced. Take the increase on new work first; it buys back the hours you would otherwise hire for, at zero risk.', effort: 'Low', payback: 'Immediate' },
    { title: 'Cut the bottom fifth of the work', detail: (s) => `Rank every ${s.unit} of the last six months by ${s.margin}. The bottom fifth is almost certainly consuming a third of your delivery time. Stop selling it.`, effort: 'Medium', payback: '4 to 8 weeks' },
    { title: 'Standardise the two things you do most', detail: () => 'Not everything, just the two. A checklist and a fixed scope for your two most common jobs removes most of the improvisation cost and is the precondition for anyone else ever doing them.', effort: 'Medium', payback: '6 to 10 weeks' },
    { title: 'Buy back the worst four hours', detail: () => 'Identify the four hours a week you most resent and least need to do personally, and pay someone to take them. At this size, delegation works better bought in small pieces than in whole roles.', effort: 'Low', payback: '2 to 3 weeks' },
  ],
  pricing: [
    { title: 'Cost the work properly, once', detail: (s) => `Take your last twenty ${s.unit}s and put real time against each one, including the parts you do not bill. You will find at least one category losing money. Most owners find two.`, effort: 'Medium', payback: '2 to 4 weeks' },
    { title: 'Shorten the offer list', detail: () => 'Businesses this size typically sell four to six things well and list twelve. Every extra line costs setup, explanation and attention. Cut to three tiers with a clear reason to move up.', effort: 'Medium', payback: '4 to 8 weeks' },
    { title: 'Take a real increase on new work', detail: () => 'Not five percent. Set the new price where the arithmetic says it should be, apply it to new customers only, and let the existing book roll over on renewal. The fear of losing everyone is almost never borne out.', effort: 'Low', payback: 'Immediate' },
    { title: 'Kill the verbal discount', detail: () => 'Write down what you will and will not discount and who may approve it, even if that is only you. Undocumented discretion is where small-business margin quietly goes.', effort: 'Low', payback: '2 weeks' },
  ],
  concentration: [
    { title: 'Name the exposure in numbers', detail: () => 'Work out exactly what share of revenue and of profit the largest relationship carries. Above a quarter, this belongs at the top of the plan; above a half, it is the plan.', effort: 'Low', payback: '1 week' },
    { title: 'Make the big relationship harder to leave', detail: () => 'Before you diversify, defend. A longer term, a broader scope or a genuine switching cost buys the time you need to build the alternative.', effort: 'Medium', payback: '4 to 8 weeks' },
    { title: 'Build one owned channel', detail: () => 'A list, a location or a direct relationship, something you would keep if the platform or the referrer disappeared tomorrow. Start it now even though it will be slow.', effort: 'High', payback: '3 to 6 months' },
    { title: 'Set a concentration rule', detail: () => 'Write down the maximum share of revenue any one client may hold, and what you do when a new deal would breach it. Deciding this while calm is the whole point.', effort: 'Low', payback: '1 week' },
  ],
  owner: [
    { title: 'Write down the two things only you can do', detail: () => 'Then write down why. Half the time the reason is genuine expertise; the other half it is that nobody has been shown. The second half is your first delegation list.', effort: 'Low', payback: '2 weeks' },
    { title: 'Move from doing to deciding on one process', detail: () => 'Pick a single process, quoting or scheduling or ordering, and hand over the doing while you keep the approval. One clean handover teaches more than a reorganisation.', effort: 'Medium', payback: '6 to 10 weeks' },
    { title: 'Install a weekly fifteen-minute number', detail: () => 'One meeting, one page, the same five figures every week. It is the cheapest substitute for you being in every conversation.', effort: 'Low', payback: '3 to 4 weeks' },
    { title: 'Take four consecutive days off, deliberately', detail: () => 'Not as a reward. As a test. Whatever breaks is your documentation backlog, discovered for the cost of a long weekend.', effort: 'Medium', payback: '4 weeks' },
  ],
  visibility: [
    { title: 'Define five numbers and nothing else', detail: (s) => `Cash on hand, revenue booked, ${s.margin}, enquiries in, and one leading indicator for your main channel. Five is enough at this size, and a sixth reliably means none get looked at.`, effort: 'Low', payback: '2 to 3 weeks' },
    { title: 'Separate the customer types in your books', detail: () => 'Most micro businesses run one blended P&L over two or three quite different businesses. Splitting them usually reveals that one is subsidising another.', effort: 'Medium', payback: '4 to 6 weeks' },
    { title: 'Put the five numbers on one page, weekly', detail: () => 'A spreadsheet is fine and usually better. The discipline is the cadence, not the tooling.', effort: 'Low', payback: '2 weeks' },
    { title: 'Run one decision through the numbers', detail: () => 'Take the next real decision, a hire or a price or a lease, and force it through the new page. That is what makes the habit stick.', effort: 'Low', payback: '4 weeks' },
  ],
}

const GOAL_FRAME = {
  profit:  { verb: 'take more out of the same business', tension: 'Growth is not your lever this year. Margin is. That is good news, because margin moves faster.' },
  grow:    { verb: 'get materially bigger', tension: 'Growth on an unfixed foundation multiplies whatever is broken. Expect the first thirty days to look like tidying rather than growing.' },
  hours:   { verb: 'get the hours back', tension: 'Fewer hours in a business this size is bought with either higher prices or documented process. Usually both, in that order.' },
  delegate:{ verb: 'build something that runs without you', tension: 'Delegation fails when it is attempted as a whole role. It works when it is attempted one process at a time.' },
  exit:    { verb: 'make the business sellable', tension: 'Buyers discount owner dependency more heavily than any other factor at this size. Everything below is really about that.' },
}

const HOURS = {
  tiny: { label: 'under 2 hours a week', cap: 1, note: 'At under two hours a week we cut the plan to two moves and run one per thirty-day block. Anything more is a plan that fails quietly.' },
  some: { label: '2 to 5 hours a week', cap: 2, note: 'Two to five hours a week is enough for three moves: two in the first block, the third once those are running.' },
  real: { label: '5 to 10 hours a week', cap: 3, note: 'Enough to run two moves at once in the first block and start the third early, provided one of them is delegated.' },
  lots: { label: 'more than 10 hours a week', cap: 3, note: 'Time is no longer the binding constraint; attention is. We still hold the plan to three moves so none of them is done badly.' },
}

const RISK = {
  solo:  'The largest risk in a business of one is that the plan competes directly with billable hours. Protect the time in the calendar before the first block starts, or it will not happen.',
  micro: 'With two or three people, one departure or one illness stalls everything. Whatever you change, make sure at least one other person understands it.',
  small: 'At four to six people the failure mode is a plan that lives only in the owner\'s head. Brief the team on the ninety-day objective explicitly, or you will be the only one running it.',
  ten:   'At seven to ten you are past the point where the owner can hold it all. If nobody else owns a block of this plan, it will not survive the first busy month.',
}

const pick = (arr, n) => arr.slice(0, n)

export function generateBrief(a) {
  const s = SECTOR[a.sector] || SECTOR.other
  const size = SIZE[a.size] || SIZE.micro
  const c = CONSTRAINT[a.constraint]
  const goal = GOAL_FRAME[a.goal]
  const hours = HOURS[a.hours]
  const moveCount = hours.cap === 1 ? 2 : 3
  const moves = pick(MOVES[a.constraint], moveCount).map((m) => ({
    title: m.title,
    detail: typeof m.detail === 'function' ? m.detail(s) : m.detail,
    effort: m.effort,
    payback: m.payback,
  }))

  const scale =
    a.revenue === 'pre' ? 'still proving the model'
    : a.revenue === 'early' ? 'past proving it and into the awkward middle'
    : a.revenue === 'mid' ? 'at the size where structure starts to pay for itself'
    : a.revenue === 'upper' ? 'at the top end of what one person can hold in their head'
    : 'beyond the size we normally work with, and you should read this accordingly'

  const headline = `A ${s.noun} of this size wanting to ${goal.verb}, held back by ${c.name.toLowerCase()}.`

  const position = `You are running ${size.label}, ${scale}. The ceiling in front of you is ${size.ceiling}. You told us the thing most in the way is ${c.name.toLowerCase()}, and you have ${hours.label} to spend on changing it. ${goal.tension}`

  const firstBlock = moves.slice(0, hours.cap === 1 ? 1 : 2)
  const secondBlock = moves.slice(firstBlock.length)

  const plan = [
    {
      block: 'Days 1 to 30',
      objective: `Prove the diagnosis and remove the cheapest obstacle`,
      moves: firstBlock.map((m) => m.title),
      metric: a.constraint === 'pricing' || a.constraint === 'visibility'
        ? `${s.margin[0].toUpperCase()}${s.margin.slice(1)}, measured for the first time`
        : `Baseline: ${s.unit}s and enquiries, counted weekly`,
    },
    {
      block: 'Days 31 to 60',
      objective: `Commit properly to the one direction and let the second-order effects show up`,
      moves: secondBlock.map((m) => m.title),
      metric: a.goal === 'grow'
        ? `Enquiries per week, and the share that convert`
        : a.goal === 'hours'
        ? `Owner hours in delivery, logged honestly`
        : `${s.margin[0].toUpperCase()}${s.margin.slice(1)}, trending`,
    },
    {
      block: 'Days 61 to 90',
      objective: `Make it survive you: write it down, hand off one piece, set the next quarter`,
      moves: ['Document what worked', 'Hand one process to someone else', 'Set the next ninety'],
      metric: `The same number as block two, held for four consecutive weeks`,
    },
  ]

  const stop = [
    a.constraint === 'leads'
      ? 'Any channel you are not prepared to give twelve weeks to'
      : 'Any new initiative that is not one of the three moves above',
    a.constraint === 'pricing' || a.goal === 'profit'
      ? 'Discounting without a written reason'
      : 'Work you would not take again at the price you took it',
    a.size === 'solo' || a.constraint === 'owner'
      ? 'Doing anything at 11pm that a checklist could do at 9am'
      : 'Meetings without a number attached',
  ]

  return {
    source: 'local',
    headline,
    position,
    constraint: { name: c.name, why: c.why, evidence: c.evidence },
    moves,
    hoursNote: hours.note,
    plan,
    stop,
    risk: RISK[a.size] || RISK.micro,
  }
}
