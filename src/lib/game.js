export const MAX_HEARTS = 10
export const HEART_REGEN_MIN = 20
export const DAILY_GOAL_DEFAULT = 30

export const dayKey = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}
export const addDays = (key, n) => {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + n))
}

export function initialProgress() {
  return {
    version: 1,
    xp: 0,
    xpByDay: {},
    streak: 0,
    bestStreak: 0,
    lastActiveDay: null,
    hearts: MAX_HEARTS,
    heartsUpdatedAt: Date.now(),
    dailyGoal: DAILY_GOAL_DEFAULT,
    heartsV2: true, // ya nace con el máximo de 10 vidas
    enrolled: [], // ids de cursos en los que el usuario está inscrito
    activeCourse: null,
    lessons: {}, // lessonId -> { best, times, completedAt }
    srs: {}, // questionId -> card
    interview: {}, // interviewId -> card
    exams: {}, // examId -> [{ score, total, date, seconds }]
    readings: {}, // unitId -> fecha de lectura
    stats: { answered: 0, correct: 0, lessonsDone: 0, reviewsDone: 0, perfectLessons: 0 },
    updatedAt: Date.now(),
  }
}

// Regenera vidas según el tiempo transcurrido
export function regenHearts(p, now = Date.now()) {
  if (p.hearts >= MAX_HEARTS) return { ...p, heartsUpdatedAt: now }
  const gained = Math.floor((now - p.heartsUpdatedAt) / (HEART_REGEN_MIN * 60000))
  if (gained <= 0) return p
  const hearts = Math.min(MAX_HEARTS, p.hearts + gained)
  return { ...p, hearts, heartsUpdatedAt: hearts >= MAX_HEARTS ? now : p.heartsUpdatedAt + gained * HEART_REGEN_MIN * 60000 }
}

export function minutesToNextHeart(p, now = Date.now()) {
  if (p.hearts >= MAX_HEARTS) return 0
  const elapsed = (now - p.heartsUpdatedAt) / 60000
  return Math.max(1, Math.ceil(HEART_REGEN_MIN - (elapsed % HEART_REGEN_MIN)))
}

// Registra XP y actualiza racha
export function addXp(p, amount) {
  const today = dayKey()
  let { streak, lastActiveDay, bestStreak } = p
  if (lastActiveDay !== today) {
    streak = lastActiveDay === addDays(today, -1) ? streak + 1 : 1
    lastActiveDay = today
  }
  return {
    ...p,
    xp: p.xp + amount,
    xpByDay: { ...p.xpByDay, [today]: (p.xpByDay[today] || 0) + amount },
    streak,
    bestStreak: Math.max(bestStreak || 0, streak),
    lastActiveDay,
  }
}

// La racha se pierde si no hubo actividad ayer ni hoy
export function currentStreak(p) {
  const today = dayKey()
  if (p.lastActiveDay === today || p.lastActiveDay === addDays(today, -1)) return p.streak
  return 0
}

const LEVELS = [0, 60, 150, 300, 500, 750, 1050, 1400, 1800, 2300, 2900, 3600, 4400, 5300, 6300, 7500]
export function levelInfo(xp) {
  let lvl = 0
  while (lvl + 1 < LEVELS.length && xp >= LEVELS[lvl + 1]) lvl++
  const cur = LEVELS[lvl]
  const next = LEVELS[lvl + 1] ?? cur + 1500
  return { level: lvl + 1, cur, next, pct: Math.min(1, (xp - cur) / (next - cur)) }
}

export const TITLES = ['Novato', 'Aprendiz', 'Explorador', 'Constructor', 'Artesano', 'Swifter', 'Experto', 'Maestro', 'Arquitecto', 'Leyenda']
export const titleFor = (level) => TITLES[Math.min(TITLES.length - 1, Math.floor((level - 1) / 2))]

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
