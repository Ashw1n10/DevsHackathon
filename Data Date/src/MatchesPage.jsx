import { useState, useEffect } from 'react'
import styles from './styles/MatchesPage.module.css';
import Logo from './assets/Logo.png'
import PersonIcon from '@mui/icons-material/Person';
import Disc from './assets/MusicDisc.png'



function MatchesPage() {
  const [spun, setSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(5);
  const [lastSpinDate, setLastSpinDate] = useState('');
  const [timeUntilNextDay, setTimeUntilNextDay] = useState('');

  // Calculate time until next day
  const calculateTimeUntilNextDay = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeDiff = tomorrow - now;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update countdown timer every second
  useEffect(() => {
    if (spinsLeft === 0) {
      const timer = setInterval(() => {
        setTimeUntilNextDay(calculateTimeUntilNextDay());
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [spinsLeft]);

  // Check and reset spins daily
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('lastSpinDate');
    const savedSpins = localStorage.getItem('spinsLeft');

    if (savedDate && savedDate !== today) {
      // New day, reset spins
      setSpinsLeft(5);
      setLastSpinDate(today);
      localStorage.setItem('spinsLeft', '5');
      localStorage.setItem('lastSpinDate', today);
    } else if (savedSpins) {
      // Same day, load saved spins
      setSpinsLeft(parseInt(savedSpins));
      setLastSpinDate(savedDate || today);
    } else {
      // First time, set initial values
      setLastSpinDate(today);
      localStorage.setItem('lastSpinDate', today);
      localStorage.setItem('spinsLeft', '5');
    }
  }, []);

  const handleDiscClick = () => {
    if (!isSpinning && spinsLeft > 0) {
      setIsSpinning(true);
      const newSpinsLeft = spinsLeft - 1;
      setSpinsLeft(newSpinsLeft);
      localStorage.setItem('spinsLeft', newSpinsLeft.toString());
      
      setTimeout(() => {
        setIsSpinning(false);
        setSpun(true);
      }, 5000);
    }
  };

  return (
    <>
    <div className={styles.background}></div>
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

      <div className={styles.lock}>
        {spinsLeft > 0 && (
          <p>You have {spinsLeft} Spins left</p>
        )}
        {spinsLeft === 0 && (
          <p>Come back in: {timeUntilNextDay}</p>
        )}
      </div>

    </>
  )
}

export default MatchesPage
