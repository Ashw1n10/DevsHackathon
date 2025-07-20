import { useState, useEffect } from 'react';
import styles from './styles/MatchProfilePopup.module.css';
import BoxList from './BoxList';

function MatchProfilePopup({ onClose, matchData, partnerData, matchedUserData }) {
  // Function to get a random match from matchedUserData
  const getRandomMatch = () => {
    if (!matchedUserData || !matchedUserData.matches || matchedUserData.matches.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * matchedUserData.matches.length);
    return matchedUserData.matches[randomIndex];
  };

  // Get random match data
  const randomMatch = getRandomMatch();

  // Use real data from random match or fallback to placeholder data
  const artists = randomMatch?.top_artists || [
    { name: 'Taylor Swift' },
    { name: 'Drake' },
    { name: 'Billie Eilish' },
    { name: 'The Weeknd' },
    { name: 'Adele' },
  ];
  
  const genres = randomMatch?.top_genres || [
    { name: 'Pop' },
    { name: 'Hip-Hop' },
    { name: 'R&B' },
    { name: 'Indie' },
    { name: 'Rock' },
  ];
  
  const songs = randomMatch?.top_songs?.map(song => ({ name: song, artist: 'Unknown Artist' })) || [
    { name: 'Blank Space', artist: 'Taylor Swift' },
    { name: 'God\'s Plan', artist: 'Drake' },
    { name: 'bad guy', artist: 'Billie Eilish' },
    { name: 'Blinding Lights', artist: 'The Weeknd' },
    { name: 'Hello', artist: 'Adele' },
  ];

  // Calculate match percentage from random match or use default
  const matchPercentage = randomMatch?.combined_score ? Math.round(randomMatch.combined_score * 100) : 99;

  return (
    <>
      <div className={styles.popupContainer}>
        <button className={styles.closeBtn} onClick={onClose}>X</button>
        <p className={styles.foundText}>You've found a match!</p>
        <p className={styles.userText}>@{randomMatch?.user_id || 'MyNewGirlfriend'}</p>
        <p className={styles.percent}>{matchPercentage}% Match</p>
        <p className={styles.percentText}>Match made in heaven!?</p>
        <div className={styles.break}></div>
        <p className={styles.subheading}>Matching Artists</p>
        <BoxList items={artists} type="artist" />
        <p className={styles.subheading}>Matching Genres</p>
        <BoxList items={genres} type="genre" />
        <p className={styles.subheading}>Matching Songs</p>
        <BoxList items={songs} type="song" />
      </div>
    </>
  );
}

export default MatchProfilePopup;
