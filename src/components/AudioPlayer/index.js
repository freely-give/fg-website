import React, { useState } from 'react';
import styles from './styles.module.css';

export default function AudioPlayer({ src }) {
  const [error, setError] = useState(false);
  
  // Make sure the src path is correctly formatted
  const audioSrc = src.startsWith('/') ? src : `/${src}`;
  
  const handleError = () => {
    console.error(`Failed to load audio: ${audioSrc}`);
    setError(true);
  };

  return (
    <div className={styles.audioContainer}>
      {error ? (
        <div className={styles.audioError}>
          Audio file could not be loaded. Please try again later.
        </div>
      ) : (
        <audio 
          controls 
          className={styles.audioPlayer}
          onError={handleError}
        >
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}