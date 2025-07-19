import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import LandingPage from './LandingPage.jsx'
import LogIn from './LogIn.jsx'
createRoot(document.getElementById('root')).render(
    <LogIn />
)
