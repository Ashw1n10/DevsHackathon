import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles/UserProfile.module.css'
import Logo from './assets/Logo.png'

import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';

function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to read formatted user data from JSON file
  const readFormattedUserData = async () => {
    try {
      const response = await fetch('/backend/formatted_user_data.json');
      if (response.ok) {
        const data = await response.json();
        console.log('📄 User Profile Data from JSON:', data);
        setUserData(data.data); // Access the 'data' property from the JSON structure
        setLoading(false);
        return data;
      } else {
        console.log('❌ Could not read formatted_user_data.json - file may not exist yet');
        setLoading(false);
        return null;
      }
    } catch (error) {
      console.error('❌ Error reading formatted user data:', error);
      setLoading(false);
      return null;
    }
  };

  // Load user data on component mount
  useEffect(() => {
    readFormattedUserData();
  }, []);

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

  // Format real data from JSON or use placeholder data as fallback
  const topArtists = userData?.top_artists?.map((artist, index) => ({
    rank: index + 1,
    name: artist,
    genres: ["Unknown"], // Placeholder since genres aren't in the data
    popularity: 90,
    followers: 1000000
  })) || [
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

  const topGenres = userData?.top_genres?.map((genre, index) => ({
    rank: index + 1,
    name: genre,
    count: 1,
    percentage: 100 - (index * 10)
  })) || [
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

  const topSongs = userData?.top_songs?.map((song, index) => ({
    rank: index + 1,
    name: typeof song === 'string' ? song : song.name,
    artist: typeof song === 'string' ? 'Unknown Artist' : song.artist,
    album: "Unknown Album",
    duration: "3:00"
  })) || [
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

  if (loading) {
    return (
      <div className={styles.background}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading your music profile...
        </div>
      </div>
    );
  }

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
