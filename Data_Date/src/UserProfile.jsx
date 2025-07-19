import React from 'react'
import './styles/UserProfile.css'
import Logo from './assets/Logo.png'

function UserProfile({ onNavigate = () => {} }) {
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

  return (
    <>
      <div className="nav">
        <div className='leftNav'>
          <div>
            <img src={Logo} alt="Logo" className="logo" />
          </div>
          <button onClick={() => onNavigate('landing')} className="about">Home</button>
          <button onClick={() => onNavigate('chat')} className="about">💬 Chat</button>
        </div>
        <button className="login">Login</button>
      </div>
      
      <div className="profile-container">
        <h1 className="profile-title">🎵 Your Spotify Music Profile</h1>
        
        <div className="sections-container">
          {/* Top Artists Section */}
          <div className="section">
            <h2 className="section-title">🎤 Your Top 10 Artists</h2>
            {topArtists.map((artist) => (
              <div key={artist.rank} className="artist">
                <div className="artist-name">#{artist.rank} {artist.name}</div>
                <div className="artist-genres">Genres: {artist.genres.join(", ")}</div>
              </div>
            ))}
          </div>

          {/* Top Genres Section */}
          <div className="section">
            <h2 className="section-title">🎭 Your Top 10 Genres</h2>
            {topGenres.map((genre) => (
              <div key={genre.rank} className="genre">
                <div className="genre-name">#{genre.rank} {genre.name}</div>
                <div className="genre-placeholder">Genre</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile
