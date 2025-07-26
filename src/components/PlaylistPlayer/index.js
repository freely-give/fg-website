import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

export default function PlaylistPlayer({ songs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'
  const [error, setError] = useState(false);
  const audioRef = useRef(null);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all' || currentIndex < songs.length - 1) {
        goToNext();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      console.error(`Failed to load audio: ${currentSong.src}`);
      setError(true);
    };

    const handleCanPlay = () => {
      setError(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentIndex, repeatMode, songs, currentSong.src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const goToNext = () => {
    const wasPlaying = isPlaying;
    let nextIndex;
    
    if (repeatMode === 'all' && currentIndex === songs.length - 1) {
      nextIndex = 0;
    } else if (currentIndex < songs.length - 1) {
      nextIndex = currentIndex + 1;
    } else {
      return;
    }
    
    setCurrentIndex(nextIndex);
    
    if (wasPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play();
        }
      }, 50);
    }
  };

  const goToPrevious = () => {
    const wasPlaying = isPlaying;
    let prevIndex;
    
    if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    } else if (repeatMode === 'all') {
      prevIndex = songs.length - 1;
    } else {
      return;
    }
    
    setCurrentIndex(prevIndex);
    
    if (wasPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play();
        }
      }, 50);
    }
  };

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const selectSong = (index) => {
    const wasPlaying = isPlaying;
    setCurrentIndex(index);
    setError(false);
    
    if (wasPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play();
        }
      }, 50);
    }
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return '1';
      case 'all': return '∞';
      default: return '↻';
    }
  };

  return (
    <div className={styles.playlistContainer}>
      {error ? (
        <div className={styles.audioError}>
          Audio file could not be loaded. Please try again later.
        </div>
      ) : (
        <>
          <audio 
            ref={audioRef}
            src={currentSong.src}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls
            className={styles.audioPlayer}
          />
          
          <div className={styles.playlistInfo}>
            <div className={styles.currentSong}>
              {currentIndex + 1}. {currentSong.title}
            </div>
            
            <div className={styles.controls}>
              <button 
                onClick={goToPrevious} 
                disabled={currentIndex === 0 && repeatMode !== 'all'}
                className={styles.controlButton}
                title="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              
              <button 
                onClick={goToNext} 
                disabled={currentIndex === songs.length - 1 && repeatMode !== 'all'}
                className={styles.controlButton}
                title="Next"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 18h2V6h-2v12zM6 6v12l8.5-6z"/>
                </svg>
              </button>
              
              <button 
                onClick={toggleRepeat}
                className={`${styles.controlButton} ${repeatMode !== 'none' ? styles.active : ''}`}
                title={`Repeat: ${repeatMode}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                  {repeatMode === 'one' && (
                    <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">1</text>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}