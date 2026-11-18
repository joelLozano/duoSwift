import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { lessonById, isLessonUnlocked, isReadingDone, unitById, courseById } from '../data/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import QuizSession from '../components/QuizSession.jsx'
import ResultScreen, { fmtTime } from '../components/ResultScreen.jsx'
import { shuffle } from '../lib/game.js'

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { progress, completeLesson } = useProgress()
  const [result, setResult] = useState(null)
  const [run, setRun] = useState(0)
  const lesson = lessonById[lessonId]
  const questions = useMemo(() => (lesson ? shuffle(lesson.questions) : []), [lesson, run]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!lesson || !isLessonUnlocked(lessonId, progress.lessons)) return <Navigate to="/" replace />
  // Primero la lectura de la unidad; al terminarla, la lectura ofrece volver a esta lección
  if (!isReadingDone(lesson.unitId, progress.readings)) {
    return <Navigate to={`/readings/${lesson.unitId}`} replace state={{ pendingLesson: lessonId }} />
  }

  const unit = unitById[lesson.unitId]
  const alreadyDone = Boolean(progress.lessons[lessonId])

  if (result) {
    const courseLessons = courseById[lesson.courseId].lessons
    const idx = courseLessons.findIndex((l) => l.id === lessonId)
    const next = courseLessons[idx + 1]
    const perfect = result.score === 1
    return (
      <ResultScreen
        emoji={perfect ? '👑' : result.score >= 0.7 ? '🎉' : '💪'}
        title={perfect ? '¡Lección perfecta!' : '¡Lección completada!'}
        subtitle={`${unit.title} · ${lesson.title}`}
        stats={[
          { label: 'XP', value: `+${result.xp}`, color: 'var(--gold)' },
          { label: 'Precisión', value: `${Math.round(result.score * 100)}%`, color: 'var(--green)' },
          { label: 'Tiempo', value: fmtTime(result.seconds), color: 'var(--blue)' },
        ]}
      >
        {next && unitById[next.unitId] === unit && (
          <button className="btn btn-primary btn-lg" onClick={() => { setResult(null); navigate(`/lesson/${next.id}`) }}>Siguiente lección</button>
        )}
        {(!next || unitById[next.unitId] !== unit) && (
          <button className="btn btn-primary btn-lg" onClick={() => navigate(`/exam/${unit.id}`)}>Presentar examen de la unidad</button>
        )}
        <button className="btn btn-ghost" onClick={() => { setResult(null); setRun((r) => r + 1) }}>Repetir lección</button>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>Volver al camino</button>
      </ResultScreen>
    )
  }

  return (
    <QuizSession
      key={lessonId + run}
      questions={questions}
      useHearts
      title={lesson.title}
      onExit={() => navigate('/')}
      onComplete={(r) => {
        const xp = (alreadyDone ? 5 : 10) + (r.score === 1 ? 5 : 0)
        completeLesson(lessonId, r.score, xp)
        setResult({ ...r, xp })
      }}
    />
  )
}
