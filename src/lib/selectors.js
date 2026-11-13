import { allQuestions, courses, courseById, DEFAULT_COURSE } from '../data/index.js'
import { isDue, strength } from './srs.js'
import { dayKey } from './game.js'
import { useProgress } from '../context/ProgressContext.jsx'

// Curso activo del usuario (o el primero del catálogo si aún no elige)
export function useCourse() {
  const { progress } = useProgress()
  return courseById[progress?.activeCourse] || courseById[DEFAULT_COURSE]
}

const questionsOf = (courseIds) => (courseIds ? courses.filter((c) => courseIds.includes(c.id)).flatMap((c) => c.questions) : allQuestions)

// Preguntas que ya viste y que toca repasar (opcionalmente filtradas por curso)
export function dueQuestions(p, courseIds, now = Date.now()) {
  return questionsOf(courseIds)
    .filter((q) => p.srs[q.id] && isDue(p.srs[q.id], now))
    .sort((a, b) => p.srs[a.id].due - p.srs[b.id].due)
}

// Preguntas vistas con menor fuerza de memoria (práctica de puntos débiles)
export function weakQuestions(p, courseIds, n = 10, now = Date.now()) {
  return questionsOf(courseIds)
    .filter((q) => p.srs[q.id])
    .map((q) => ({ q, s: strength(p.srs[q.id], now) }))
    .sort((a, b) => a.s - b.s)
    .slice(0, n)
    .map((x) => x.q)
}

export const seenQuestions = (p, courseIds) => questionsOf(courseIds).filter((q) => p.srs[q.id])

export function dueInterview(p, course, now = Date.now()) {
  return course.interview.filter((i) => p.interview[i.id] && isDue(p.interview[i.id], now))
}

// Dominio por unidad (0..1): promedio de fuerza de memoria de sus preguntas
export function unitMastery(p, unit, now = Date.now()) {
  const qs = unit.lessons.flatMap((l) => l.questions)
  return qs.reduce((acc, q) => acc + strength(p.srs[q.id], now), 0) / qs.length
}

export function courseMastery(p, course) {
  return course.units.reduce((a, u) => a + unitMastery(p, u), 0) / course.units.length
}

export function courseLessonsDone(p, course) {
  return course.lessons.filter((l) => p.lessons[l.id]).length
}

export function todayXp(p) {
  return p.xpByDay[dayKey()] || 0
}

export function learnedCount(p, course) {
  return (course ? course.questions : allQuestions).filter((q) => p.srs[q.id]?.reps >= 2).length
}
