import { generateBrief, questions } from './engine.js'

// ---------------------------------------------------------------------------
// Snapshot client.
//
// If VITE_AI_ENDPOINT is set the answers are POSTed to your own server, which
// holds the API key and calls Claude (see api/strategy.js for a ready-made
// serverless handler). If it is not set, or the call fails, we fall back to the
// local engine so the tool always works, including offline and in preview.
// ---------------------------------------------------------------------------

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || ''
const TIMEOUT_MS = 25000

const labelFor = (id, value) => {
  const q = questions.find((x) => x.id === id)
  return q?.options.find((o) => o.value === value)?.label ?? value
}

export const readable = (answers) =>
  questions.map((q) => `${q.label} ${labelFor(q.id, answers[q.id])}`).join('\n')

function valid(brief) {
  return (
    brief &&
    typeof brief.headline === 'string' &&
    typeof brief.position === 'string' &&
    brief.constraint?.name &&
    Array.isArray(brief.moves) && brief.moves.length > 0 &&
    Array.isArray(brief.plan) && brief.plan.length > 0
  )
}

export async function requestBrief(answers) {
  const fallback = () => ({ ...generateBrief(answers), source: 'local' })

  if (!ENDPOINT) return fallback()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, readable: readable(answers) }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Endpoint returned ${res.status}`)
    const data = await res.json()
    if (!valid(data)) throw new Error('Malformed brief from endpoint')
    return { ...data, source: 'model' }
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[snapshot] falling back to local engine:', err.message)
    return fallback()
  } finally {
    clearTimeout(timer)
  }
}
