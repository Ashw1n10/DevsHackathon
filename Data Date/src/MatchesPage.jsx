// import { useState } from 'react'
import './styles/MatchesPage.css'
import Logo from './assets/Logo.png'

function MatchesPage() {

  return (
    <>
      <div className="nav">
        <div className='leftNav'>
          <div>
            <img src={Logo} alt="Logo" className="logo" />
          </div>
          <a href="" className="about">About</a>
        </div>
        <button className="login">Login</button>
      </div>
      <div className="hero">
        <div className="header">
          <h1>Find your perfect match through <span className='gradient'>music</span>.</h1>
          <div className="getStarted">
            <button><span class="buttonText">Get Started</span></button>
          </div>
        </div>

      </div>
    </>
  )
}

export default MatchesPage
