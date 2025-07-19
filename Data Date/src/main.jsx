import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import LandingPage from './LandingPage.jsx'
import MatchesPage from './MatchesPage.jsx'

createRoot(document.getElementById('root')).render(
    // <LandingPage />
    <MatchesPage />
)
