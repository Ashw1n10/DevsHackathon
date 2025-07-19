// import { useState } from 'react'
import './styles/LandingPage.css'
import Logo from './assets/Logo.png'

function LandingPage({ onNavigate = () => {} }) {

  return (
    <>
      <div className="nav">
        <div className='leftNav'>
          <div>
            <img src={Logo} alt="Logo" className="logo" />
          </div>
          <button onClick={() => onNavigate('profile')} className="about">Profile</button>
          <button onClick={() => onNavigate('chat')} className="about">💬 Chat</button>
        </div>
        <button className="login">Login</button>
      </div>
      <div className="hero">
        <div className="header">
          <h1>Find your perfect match through <span className='gradient'>music</span>.</h1>
          <div className="getStarted">
            <button onClick={() => onNavigate('profile')}><span className="buttonText">Get Started</span></button>
          </div>
        </div>

      </div>
    </>
  )
}

export default LandingPage
