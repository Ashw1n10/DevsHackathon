// import { useState } from 'react'
import styles from './styles/MatchesPage.module.css';
import Logo from './assets/Logo.png'
import PersonIcon from '@mui/icons-material/Person';

function MatchesPage() {

  return (
    <>
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <div>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </div>
          {/* <a href="" className={styles.about}>About</a> */}
        </div>
        <button className={styles.login}>
            <PersonIcon className={styles.icon} /> 
        </button>
        
      </div>

    </>
  )
}

export default MatchesPage
