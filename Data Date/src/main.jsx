import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import LandingPage from './LandingPage.jsx'

createRoot(document.getElementById('root')).render(
    <LandingPage />
)
