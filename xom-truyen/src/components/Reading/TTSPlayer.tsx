import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Settings, Volume2 } from 'lucide-react';
import './TTSPlayer.css';

interface Props {
    textToSpeak: string;
    onClose?: () => void;
}

export const TTSPlayer: React.FC<Props> = ({ textToSpeak, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            
            // Default to a Vietnamese or English voice based on availability
            const defaultVoice = availableVoices.find(v => v.lang.includes('vi')) || availableVoices[0];
            if (defaultVoice) setSelectedVoice(defaultVoice.name);
        };

        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                speak();
            }
            setIsPlaying(true);
        }
    };

    const speak = () => {
        window.speechSynthesis.cancel(); // clear queue
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        
        utterance.rate = speed;
        
        utterance.onend = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
    };

    // Restart speech if settings change while playing
    useEffect(() => {
        if (isPlaying) {
            speak();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speed, selectedVoice]);

    return (
        <div className="tts-player-container">
            <div className="tts-controls">
                <button className="tts-btn" onClick={() => {}} title="Previous Paragraph"><SkipBack size={20} /></button>
                <button className="tts-btn play-btn" onClick={togglePlay}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="tts-btn" onClick={() => {}} title="Next Paragraph"><SkipForward size={20} /></button>
                
                <div className="tts-divider"></div>
                
                <button className="tts-btn" onClick={() => setShowSettings(!showSettings)}>
                    <Settings size={20} />
                </button>
            </div>

            {showSettings && (
                <div className="tts-settings-panel">
                    <div className="tts-setting-row">
                        <label>Tốc độ: {speed}x</label>
                        <input 
                            type="range" min="0.5" max="2" step="0.25" 
                            value={speed} 
                            onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                        />
                    </div>
                    <div className="tts-setting-row">
                        <label>Giọng đọc:</label>
                        <select 
                            value={selectedVoice} 
                            onChange={(e) => setSelectedVoice(e.target.value)}
                        >
                            {voices.map(v => (
                                <option key={v.name} value={v.name}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};
