import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles/UserProfile.module.css'
import Logo from './assets/Logo.png'

import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';

function UserProfile() {
  const navigate = useNavigate();

  // Navigation handlers
  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleMatchesClick = () => {
    navigate('/matches');
  };

  // Placeholder data for top 10 artists
  const topArtists = [
    { rank: 1, name: "The Weeknd", genres: ["Pop", "R&B", "Alternative R&B"], popularity: 100, followers: 15234567 },
    { rank: 2, name: "Dua Lipa", genres: ["Pop", "Dance Pop", "UK Pop"], popularity: 98, followers: 12543876 },
    { rank: 3, name: "Harry Styles", genres: ["Pop", "Pop Rock", "UK Pop"], popularity: 97, followers: 11876543 },
    { rank: 4, name: "Olivia Rodrigo", genres: ["Pop", "Pop Rock", "Teen Pop"], popularity: 95, followers: 9876543 },
    { rank: 5, name: "Lil Nas X", genres: ["Hip Hop", "Pop Rap", "Trap"], popularity: 93, followers: 8765432 },
    { rank: 6, name: "Justin Bieber", genres: ["Pop", "Dance Pop", "Teen Pop"], popularity: 99, followers: 13456789 },
    { rank: 7, name: "Ed Sheeran", genres: ["Pop", "Singer-Songwriter", "UK Pop"], popularity: 96, followers: 14567890 },
    { rank: 8, name: "Glass Animals", genres: ["Indie Pop", "Psychedelic Pop", "Dream Pop"], popularity: 89, followers: 3456789 },
    { rank: 9, name: "The Kid LAROI", genres: ["Hip Hop", "Pop Rap", "Australian Hip Hop"], popularity: 91, followers: 5678901 },
    { rank: 10, name: "Ariana Grande", genres: ["Pop", "Dance Pop", "R&B"], popularity: 98, followers: 16789012 }
  ];

  // Placeholder data for top 10 genres
  const topGenres = [
    { rank: 1, name: "Pop", count: 18, percentage: 90.0 },
    { rank: 2, name: "Dance Pop", count: 12, percentage: 60.0 },
    { rank: 3, name: "R&B", count: 8, percentage: 40.0 },
    { rank: 4, name: "Hip Hop", count: 7, percentage: 35.0 },
    { rank: 5, name: "Pop Rap", count: 6, percentage: 30.0 },
    { rank: 6, name: "Alternative R&B", count: 5, percentage: 25.0 },
    { rank: 7, name: "UK Pop", count: 5, percentage: 25.0 },
    { rank: 8, name: "Pop Rock", count: 4, percentage: 20.0 },
    { rank: 9, name: "Teen Pop", count: 3, percentage: 15.0 },
    { rank: 10, name: "Indie Pop", count: 2, percentage: 10.0 }
  ];

  // Placeholder data for top 10 songs
  const topSongs = [
    { rank: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20" },
    { rank: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23" },
    { rank: 3, name: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: "2:47" },
    { rank: 4, name: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: "2:58" },
    { rank: 5, name: "INDUSTRY BABY", artist: "Lil Nas X", album: "MONTERO", duration: "3:32" },
    { rank: 6, name: "Stay", artist: "The Kid LAROI & Justin Bieber", album: "F*CK LOVE 3: OVER YOU", duration: "2:21" },
    { rank: 7, name: "Shivers", artist: "Ed Sheeran", album: "= (Equals)", duration: "3:27" },
    { rank: 8, name: "Heat Waves", artist: "Glass Animals", album: "Dreamland", duration: "3:58" },
    { rank: 9, name: "We Don't Talk About Bruno", artist: "Carolina Gaitán", album: "Encanto", duration: "3:36" },
    { rank: 10, name: "Break My Soul", artist: "Beyoncé", album: "RENAISSANCE", duration: "4:38" }
  ];

  return (
    <>
      <div className={styles.background}></div>
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <div>
            <img 
              src={Logo} 
              alt="Logo" 
              className={styles.logo} 
            />
          </div>
        </div>
        <div className={styles.navBtns}>
          <button className={styles.login} onClick={handleMatchesClick}>
            <HomeIcon className={styles.icon} />
          </button>
          <button className={styles.login} onClick={handleChatClick}>
            <ChatIcon className={styles.icon} />
          </button>
          <button className={`${styles.login} ${styles.profileIcon}`} onClick={handleProfileClick}>
            <PersonIcon className={styles.icon} />
          </button>
        </div>
      </div>
      
      <div className={styles.profileContainer}>
        <h1 className={styles.profileTitle}>🎵 Your Spotify Music Profile</h1>
        
        <div className={styles.sectionsContainer}>
          {/* Top Artists Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🎤 Your Top 10 Artists</h2>
            {topArtists.map((artist) => (
              <div key={artist.rank} className={styles.artist}>
                <div className={styles.artistName}>#{artist.rank} {artist.name}</div>
                <div className={styles.artistGenres}>Genres: {artist.genres.join(", ")}</div>
              </div>
            ))}
          </div>

          {/* Top Songs Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🎵 Your Top 10 Songs</h2>
            {topSongs.map((song) => (
              <div key={song.rank} className={styles.song}>
                <div className={styles.songName}>#{song.rank} {song.name}</div>
                <div className={styles.songArtist}>by {song.artist}</div>
                <div className={styles.songAlbum}>Album: {song.album}</div>
              </div>
            ))}
          </div>

          {/* Top Genres Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🎭 Your Top 10 Genres</h2>
            {topGenres.map((genre) => (
              <div key={genre.rank} className={styles.genre}>
                <div className={styles.genreName}>#{genre.rank} {genre.name}</div>
                <div className={styles.genrePlaceholder}>Genre</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile
