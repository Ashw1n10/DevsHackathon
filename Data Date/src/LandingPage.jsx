// import { useState } from 'react'
import styles from './styles/LandingPage.module.css'
import Logo from './assets/Logo.png'


function App() {

  return (
    <>
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <div>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </div>
          <a href="" className={styles.about}>About</a>
        </div>
        <button className={styles.login}>Login</button>
      </div>
      <div className={styles.hero}>
        <div className={styles.header}>
          <h1>Find your perfect match through <span className={styles.gradient}>music</span>.</h1>
          <div className={styles.getStarted}>
            <button><span className={styles.buttonText}>Get Started</span></button>
          </div>
        </div>

      </div>
    </>
  )
}

export default App
