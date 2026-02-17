import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfileEditorPage } from './pages/ProfileEditorPage'
import { PublicProfilePage } from './pages/PublicProfilePage'
import './styles/global.css'

const AnimatedRoutes = () => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('page-transition-enter-active')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      if (!prefersReducedMotion) {
        setTransitionStage('page-transition-exit-active')
        setTimeout(() => {
          setDisplayLocation(location)
          setTransitionStage('page-transition-enter')
          setTimeout(() => {
            setTransitionStage('page-transition-enter-active')
          }, 10)
        }, 300)
      } else {
        setDisplayLocation(location)
      }
    }
  }, [location, displayLocation.pathname, prefersReducedMotion])

  return (
    <div className={transitionStage} style={{ minHeight: '100vh' }}>
      <Routes location={displayLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/profile-editor" element={<ProfileEditorPage />} />
        <Route path="/profile/:handle" element={<PublicProfilePage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App

