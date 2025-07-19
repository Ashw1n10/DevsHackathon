import { useState, useEffect } from 'react';
import styles from './styles/MatchProfilePopup.module.css';
import BoxList from './BoxList';

function MatchProfilePopup({ onClose }) {
  // Placeholder data
  const artists = [
    { name: 'Taylor Swift' },
    { name: 'Drake' },
    { name: 'Billie Eilish' },
    { name: 'The Weeknd' },
    { name: 'Adele' },
  ];
  const genres = [
    { name: 'Pop' },
    { name: 'Hip-Hop' },
    { name: 'R&B' },
    { name: 'Indie' },
    { name: 'Rock' },
  ];
  const songs = [
    { name: 'Blank Space', artist: 'Taylor Swift' },
    { name: 'God’s Plan', artist: 'Drake' },
    { name: 'bad guy', artist: 'Billie Eilish' },
    { name: 'Blinding Lights', artist: 'The Weeknd' },
    { name: 'Hello', artist: 'Adele' },
  ];

  return (
    <>
      <div className={styles.popupContainer}>
        <button className={styles.closeBtn} onClick={onClose}>X</button>
        <p className={styles.foundText}>You've found a match!</p>
        <p className={styles.userText}>@MyNewGirlfriend</p>
        <p className={styles.percent}>99% Match</p>
        <p className={styles.percentText}>Match made in heaven!?</p>
        <div className={styles.break}></div>
        <p className={styles.subheading}>Matching Artists</p>
        <BoxList items={artists} type="artist" />
        <p className={styles.subheading}>Matching Genres</p>
        <BoxList items={genres} type="genre" />
        <p className={styles.subheading}>Matching Songs</p>
        <BoxList items={songs} type="song" />
        <div className={styles.btns}>
          <div>
          <button className={styles.matchBtn}  onClick={onClose}>Match</button>
          </div>
          <div>
          <button className={styles.rejectBtn}  onClick={onClose}>Reject</button>
          </div>
        </div>

      </div>
    </>
  );
}

export default MatchProfilePopup;
