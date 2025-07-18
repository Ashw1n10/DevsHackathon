// import { useState } from 'react'
import './styles/LandingPage.css'
import Logo from './assets/Logo.png'

function App() {

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
        
      </div>
    </>
  )
}

export default App
