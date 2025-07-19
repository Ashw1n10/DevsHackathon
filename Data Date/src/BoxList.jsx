import React from 'react';
import styles from './styles/MatchProfilePopup.module.css';

// items: array of objects
// type: 'artist' | 'genre' | 'song'
function BoxList({ items, type }) {
  return (
    <div className={styles.boxList}>
      {items.map((item, idx) => (
        <div className={styles.box} key={idx}>
          {type === 'song' ? (
            <>
              <div className={styles.boxMain}>{item.name}</div>
              <div className={styles.boxSub}>{item.artist}</div>
            </>
          ) : (
            <div className={styles.boxMain}>{item.name}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default BoxList; 