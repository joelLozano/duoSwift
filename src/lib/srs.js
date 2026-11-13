// Repetición espaciada basada en el algoritmo SM-2 (SuperMemo 2).
// quality: 0-5  (0-2 = fallo, 3 = difícil, 4 = bien, 5 = fácil)

const DAY = 24 * 60 * 60 * 1000

export function newCard() {
  return { ef: 2.5, interval: 0, reps: 0, lapses: 0, due: Date.now(), seen: 0, last: null }
}

export function review(card = newCard(), quality, now = Date.now()) {
  const c = { ...newCard(), ...card }
  c.seen += 1
  c.last = now
  if (quality < 3) {
    c.reps = 0
    c.lapses += 1
    c.interval = 0
    c.due = now + 10 * 60 * 1000 // vuelve a aparecer en 10 min
  } else {
    c.reps += 1
    if (c.reps === 1) c.interval = 1
    else if (c.reps === 2) c.interval = quality === 5 ? 4 : 3
    else c.interval = Math.round(c.interval * c.ef * (quality === 5 ? 1.3 : quality === 3 ? 0.8 : 1))
    c.due = now + c.interval * DAY
  }
  c.ef = Math.max(1.3, c.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  return c
}

export const isDue = (card, now = Date.now()) => card && card.due <= now

// Fuerza de memoria 0..1 (para medir dominio)
export function strength(card, now = Date.now()) {
  if (!card || !card.seen) return 0
  if (card.reps === 0) return 0.15
  const base = Math.min(1, 0.35 + card.reps * 0.15 + Math.min(card.interval, 30) / 60)
  const overdueDays = Math.max(0, (now - card.due) / DAY)
  return Math.max(0.1, base * Math.exp(-overdueDays / Math.max(2, card.interval * 2)))
}

export function formatInterval(card, now = Date.now()) {
  if (!card) return 'nueva'
  const ms = card.due - now
  if (ms <= 0) return 'pendiente'
  const min = Math.round(ms / 60000)
  if (min < 60) return `en ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `en ${h} h`
  return `en ${Math.round(h / 24)} d`
}
