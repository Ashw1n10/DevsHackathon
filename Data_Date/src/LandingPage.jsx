import { useState } from 'react';
import styles from './styles/LandingPage.module.css';
import LogIn from './LogIn';
import SignUp from './SignUp';
// import { useState } from 'react'
import Logo from './assets/Logo.png'; 


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <>
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <div>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </div>
          <a href="" className={styles.about}>About</a>
        </div>
        <button className={styles.login} onClick={() => setShowLogin(true)}>Login</button>
      </div>
      <div className={styles.hero}>
        <div className={styles.header}>
          <h1>Find your perfect match through <span className={styles.gradient}>music</span>.</h1>
          <div className={styles.getStarted}>
            <button onClick={() => setShowSignUp(true)}><span className={styles.buttonText}>Get Started</span></button>
          </div>
        </div>
      </div>
      {showLogin && <LogIn onClose={() => setShowLogin(false)} onSignUp={() => { setShowLogin(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
    </>
  );
}

export default App
