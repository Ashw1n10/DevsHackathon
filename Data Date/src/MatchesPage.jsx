import { useState } from 'react'
import styles from './styles/MatchesPage.module.css';
import Logo from './assets/Logo.png'
import PersonIcon from '@mui/icons-material/Person';
import Disc from './assets/MusicDisc.png'



function MatchesPage() {
  const [spun, setSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleDiscClick = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setTimeout(() => {
        setIsSpinning(false);
        setSpun(true);
      }, 5000);
    }
  };

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

      <div className={styles.disc}>
          <img 
            src={Disc} 
            alt="Disc" 
            onClick={handleDiscClick}
            style={{
              cursor: 'pointer',
              transition: isSpinning ? 'transform 5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
              transform: isSpinning ? 'rotate(1080deg)' : 'rotate(0deg)'
            }}
          />
      </div>

    </>
  )
}

export default MatchesPage
