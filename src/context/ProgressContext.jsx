import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { loadProgress, saveProgress, resetProgress } from '../lib/backend.js'
import { initialProgress, regenHearts, addXp, MAX_HEARTS } from '../lib/game.js'
import { review } from '../lib/srs.js'
import { courseById } from '../data/index.js'

const ProgressCtx = createContext(null)

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)
  const saveTimer = useRef(null)
  const latest = useRef(null)

  useEffect(() => {
    let alive = true
    setProgress(null)
    if (!user) return
    loadProgress(user.uid).then((p) => {
      if (!alive) return
      const merged = regenHearts({ ...initialProgress(), ...(p || {}) })
      merged.stats = { ...initialProgress().stats, ...(p?.stats || {}) }
      // Migración: usuarios anteriores al multi-curso ya estaban aprendiendo Swift
      if (!Array.isArray(p?.enrolled)) merged.enrolled = p && (p.xp > 0 || Object.keys(p.lessons || {}).length) ? ['swift'] : []
      merged.enrolled = merged.enrolled.filter((id) => courseById[id])
      if (!merged.enrolled.includes(merged.activeCourse)) merged.activeCourse = merged.enrolled[0] || null
      setProgress(merged)
    })
    return () => { alive = false }
  }, [user])

  // Regenerar vidas cada minuto
  useEffect(() => {
    if (!progress) return
    const t = setInterval(() => setProgress((p) => (p ? regenHearts(p) : p)), 60000)
    return () => clearInterval(t)
  }, [!!progress]) // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback(
    (p) => {
      latest.current = p
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => user && saveProgress(user.uid, latest.current, user), 800)
    },
    [user],
  )

  // Guardar al cerrar la pestaña
  useEffect(() => {
    const flush = () => {
      if (latest.current && user) {
        clearTimeout(saveTimer.current)
        saveProgress(user.uid, latest.current, user)
      }
    }
    window.addEventListener('beforeunload', flush)
    return () => window.removeEventListener('beforeunload', flush)
  }, [user])

  const update = useCallback(
    (fn) => {
      setProgress((prev) => {
        if (!prev) return prev
        const next = { ...fn(prev), updatedAt: Date.now() }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const actions = useMemo(
    () => ({
      // Registra una respuesta en el sistema de repetición espaciada
      answer(qid, correct, quality) {
        update((p) => ({
          ...p,
          srs: { ...p.srs, [qid]: review(p.srs[qid], quality ?? (correct ? 4 : 1)) },
          stats: { ...p.stats, answered: p.stats.answered + 1, correct: p.stats.correct + (correct ? 1 : 0) },
        }))
      },
      loseHeart() {
        update((p) => ({ ...p, hearts: Math.max(0, p.hearts - 1), heartsUpdatedAt: p.hearts >= MAX_HEARTS ? Date.now() : p.heartsUpdatedAt }))
      },
      gainHeart(n = 1) {
        update((p) => ({ ...p, hearts: Math.min(MAX_HEARTS, p.hearts + n) }))
      },
      completeLesson(lessonId, score, xp) {
        update((p) => {
          const prev = p.lessons[lessonId] || { best: 0, times: 0 }
          const n = addXp(p, xp)
          return {
            ...n,
            lessons: { ...p.lessons, [lessonId]: { best: Math.max(prev.best, score), times: prev.times + 1, completedAt: Date.now() } },
            stats: { ...p.stats, lessonsDone: p.stats.lessonsDone + 1, perfectLessons: p.stats.perfectLessons + (score === 1 ? 1 : 0) },
          }
        })
      },
      completeReview(xp) {
        update((p) => {
          const n = addXp(p, xp)
          return { ...n, hearts: Math.min(MAX_HEARTS, p.hearts + 1), stats: { ...p.stats, reviewsDone: p.stats.reviewsDone + 1 } }
        })
      },
      addXp(xp) {
        update((p) => addXp(p, xp))
      },
      saveExam(examId, result, xp) {
        update((p) => {
          const n = addXp(p, xp)
          return { ...n, exams: { ...p.exams, [examId]: [...(p.exams[examId] || []), result].slice(-20) } }
        })
      },
      markReading(unitId) {
        update((p) => (p.readings[unitId] ? p : { ...addXp(p, 5), readings: { ...p.readings, [unitId]: Date.now() } }))
      },
      rateInterview(id, quality) {
        update((p) => ({ ...addXp(p, 2), interview: { ...p.interview, [id]: review(p.interview[id], quality) } }))
      },
      enroll(courseId) {
        update((p) => ({ ...p, enrolled: p.enrolled.includes(courseId) ? p.enrolled : [...p.enrolled, courseId], activeCourse: courseId }))
      },
      leaveCourse(courseId) {
        update((p) => {
          const enrolled = p.enrolled.filter((id) => id !== courseId)
          return { ...p, enrolled, activeCourse: p.activeCourse === courseId ? enrolled[0] || null : p.activeCourse }
        })
      },
      setActiveCourse(courseId) {
        update((p) => ({ ...p, activeCourse: courseId }))
      },
      setDailyGoal(dailyGoal) {
        update((p) => ({ ...p, dailyGoal }))
      },
      async reset() {
        if (!user) return
        await resetProgress(user.uid)
        const fresh = initialProgress()
        setProgress(fresh)
        persist(fresh)
      },
    }),
    [update, user, persist],
  )

  return <ProgressCtx.Provider value={{ progress, update, ...actions }}>{children}</ProgressCtx.Provider>
}

export const useProgress = () => useContext(ProgressCtx)
