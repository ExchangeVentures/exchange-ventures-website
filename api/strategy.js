// ---------------------------------------------------------------------------
// Serverless handler for the Strategy Snapshot. Works as-is on Vercel; the body
// of `handler` ports to Netlify / Cloudflare / Express with almost no change.
//
//   1. npm i @anthropic-ai/sdk
//   2. Set ANTHROPIC_API_KEY in your host's environment (never in the client).
//   3. Set VITE_AI_ENDPOINT=/api/strategy in .env so the front end uses it.
//
// The key never reaches the browser. If this route is missing or errors, the
// front end silently falls back to the local engine in src/lib/engine.js.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are the lead strategist at Exchange Ventures, which runs two practices for businesses with fewer than ten people and usually under $2M in revenue: advisory work on expansion and improvement, and a small fund that buys or takes stakes in these businesses. You are writing as the advisory side.

House point of view:
- In a business this size, the binding constraint almost always traces back to the owner's calendar or to unit economics that were never actually calculated.
- Options are cheap; decisions are expensive. Name one direction, not four.
- Any plan must be sized to the hours the owner says they have. A plan that needs more time than they have is a plan that fails quietly.
- Prefer moves that pay back inside a quarter. Say plainly when something will not.
- Never invent numbers about their business. You only know what they told you.
- Direct, plain, specific. No consulting filler, no motivational language, no exclamation marks. Do not use em dashes.

Return ONLY valid JSON matching this shape, with no markdown fence and no commentary:
{
  "headline": "one sentence naming the business, its goal and its constraint",
  "position": "2-4 sentences: where they are, the ceiling in front of them, the tension in their stated goal",
  "constraint": { "name": "2-3 words", "why": "2-3 sentences", "evidence": "one sentence starting 'Look for this:'" },
  "moves": [ { "title": "imperative, under 8 words", "detail": "2-3 sentences, specific", "effort": "Low|Medium|High", "payback": "e.g. 4-8 weeks" } ],
  "hoursNote": "one sentence on how their available hours cap the plan",
  "plan": [ { "block": "Days 1 to 30", "objective": "one line", "moves": ["short", "short"], "metric": "the single number that says it is working" } ],
  "stop": ["three things to stop doing, one line each"],
  "risk": "one paragraph on the most likely way this plan fails for a business their size"
}
Exactly 3 moves and exactly 3 plan blocks (Days 1 to 30, Days 31 to 60, Days 61 to 90).`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { readable } = req.body || {}
    if (!readable || typeof readable !== 'string' || readable.length > 4000) {
      return res.status(400).json({ error: 'Bad request' })
    }

    const msg = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 4096,
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Write the Snapshot brief for this business.\n\n${readable}`,
        },
      ],
    })

    const text = msg.content.find((b) => b.type === 'text')?.text?.trim() ?? ''
    const json = text.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '')
    return res.status(200).json(JSON.parse(json))
  } catch (err) {
    console.error('[api/strategy]', err)
    // Front end falls back to the local engine on any non-200.
    return res.status(502).json({ error: 'Generation failed' })
  }
}
