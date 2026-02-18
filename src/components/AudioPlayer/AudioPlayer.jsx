import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Pause, Play } from 'lucide-react';
import './AudioPlayer.css';

const AudioPlayer = ({ audioId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = (e) => {
        e.stopPropagation(); // Evitar expandir/colapsar el card al pulsar el botón

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className="audio-player-container">
            <audio
                ref={audioRef}
                src={`/audio/${audioId}.mp3`}
                onEnded={handleEnded}
            />
            <button
                className={`audio-player-button ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pausar audioguía" : "Reproducir audioguía"}
            >
                {isPlaying ? <Pause size={18} /> : <Headphones size={18} />}
                <span>{isPlaying ? "Reproduciendo..." : "Reproducir Audioguía"}</span>
            </button>
        </div>
    );
};

export default AudioPlayer;

