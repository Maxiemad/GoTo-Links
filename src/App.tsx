import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfileEditorPage } from './pages/ProfileEditorPage'
import { PublicProfilePage } from './pages/PublicProfilePage'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/profile-editor" element={<ProfileEditorPage />} />
        <Route path="/profile/:handle" element={<PublicProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

