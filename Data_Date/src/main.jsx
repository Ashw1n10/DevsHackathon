import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import LandingPage from './LandingPage.jsx'
import SignUp from './SignUp.jsx'
import MatchesPage from './MatchesPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/matches" element={<MatchesPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
