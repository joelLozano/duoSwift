import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { useProgress } from './context/ProgressContext.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Learn from './pages/Learn.jsx'
import LessonPage from './pages/LessonPage.jsx'
import Review from './pages/Review.jsx'
import Readings from './pages/Readings.jsx'
import ReadingPage from './pages/ReadingPage.jsx'
import Exams from './pages/Exams.jsx'
import ExamPage from './pages/ExamPage.jsx'
import Interview from './pages/Interview.jsx'
import ProgressPage from './pages/Progress.jsx'
import Profile from './pages/Profile.jsx'
import Courses from './pages/Courses.jsx'

function Splash() {
  return (
    <div className="splash">
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="72" height="72" className="pulse" />
      <p>Cargando…</p>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()
  const { progress } = useProgress()
  const location = useLocation()

  if (loading) return <Splash />
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }
  if (!progress) return <Splash />
  // Primera vez: elegir qué aprender
  if (progress.enrolled.length === 0 && location.pathname !== '/courses') return <Navigate to="/courses" replace />

  return (
    <Routes>
      {/* Pantallas de sesión a pantalla completa */}
      <Route path="/lesson/:lessonId" element={<LessonPage />} />
      <Route path="/exam/:examId" element={<ExamPage />} />
      <Route element={<Layout />}>
        <Route index element={<Learn />} />
        <Route path="review" element={<Review />} />
        <Route path="readings" element={<Readings />} />
        <Route path="readings/:unitId" element={<ReadingPage />} />
        <Route path="exams" element={<Exams />} />
        <Route path="interview" element={<Interview />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="courses" element={<Courses />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
