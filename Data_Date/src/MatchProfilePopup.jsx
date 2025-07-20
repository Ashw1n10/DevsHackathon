import { useState, useEffect } from 'react';
import styles from './styles/MatchProfilePopup.module.css';
import BoxList from './BoxList';

function MatchProfilePopup({ onClose, matchData, partnerData, matchedUserData }) {
  // Function to get a random match from matchedUserData
  const getRandomMatch = () => {
    if (!matchedUserData || !matchedUserData.matches || matchedUserData.matches.length === 0) {
      console.log('No matchedUserData available, using fallback');
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * matchedUserData.matches.length);
    const selectedMatch = matchedUserData.matches[randomIndex];
    console.log('Selected random match:', selectedMatch);
    console.log('Combined score:', selectedMatch.combined_score);
    return selectedMatch;
  };

  // Function to get random items from a list
  const getRandomItems = (list, count = 5) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Get random match data
  const randomMatch = getRandomMatch();

  // Fallback data lists
  const allArtists = [
    { name: 'Taylor Swift' },
    { name: 'Drake' },
    { name: 'Billie Eilish' },
    { name: 'The Weeknd' },
    { name: 'Adele' },
    { name: 'Ed Sheeran' },
    { name: 'Post Malone' },
    { name: 'Ariana Grande' },
    { name: 'Dua Lipa' },
    { name: 'Justin Bieber' },
    { name: 'BTS' },
    { name: 'Bad Bunny' },
    { name: 'Olivia Rodrigo' },
    { name: 'Doja Cat' },
    { name: 'Lil Nas X' },
  ];

  const allGenres = [
    { name: 'Pop' },
    { name: 'Hip-Hop' },
    { name: 'R&B' },
    { name: 'Indie' },
    { name: 'Rock' },
    { name: 'Electronic' },
    { name: 'Country' },
    { name: 'Jazz' },
    { name: 'Classical' },
    { name: 'Folk' },
    { name: 'Blues' },
    { name: 'Reggae' },
    { name: 'Latin' },
    { name: 'K-Pop' },
    { name: 'Alternative' },
  ];

  // Use real data from random match or fallback to random placeholder data
  const artists = randomMatch?.top_artists || getRandomItems(allArtists);
  
  const genres = randomMatch?.top_genres || getRandomItems(allGenres);
  
  const songs = randomMatch?.top_songs?.map(song => ({ name: song, artist: 'Unknown Artist' })) || [
    { name: 'Blank Space', artist: 'Taylor Swift' },
    { name: 'God\'s Plan', artist: 'Drake' },
    { name: 'bad guy', artist: 'Billie Eilish' },
    { name: 'Blinding Lights', artist: 'The Weeknd' },
    { name: 'Hello', artist: 'Adele' },
  ];

  // Calculate match percentage from random match or use default
  const matchPercentage = randomMatch?.combined_score ? Math.round(randomMatch.combined_score * 100) : 99;
  
  console.log('Final match percentage:', matchPercentage);
  console.log('Random match used:', randomMatch);

  return (
    <>
      <div className={styles.popupContainer}>
        <button className={styles.closeBtn} onClick={onClose}>X</button>
        <p className={styles.foundText}>You've found a match!</p>
        <p className={styles.userText}>@{randomMatch?.user_id || 'MyNewGirlfriend'}</p>
        <p className={styles.percent}>{matchPercentage}% Match</p>
        <p className={styles.percentText}>Match made in heaven!?</p>
        <div className={styles.break}></div>
        <p className={styles.subheading}>Matched Top Artists</p>
        <BoxList items={artists} type="artist" />
        <p className={styles.subheading}>Matched Top Genres</p>
        <BoxList items={genres} type="genre" />
        <p className={styles.subheading}>Matched Top Songs</p>
        <BoxList items={songs} type="song" />
      </div>
    </>
  );
}

export default MatchProfilePopup;
