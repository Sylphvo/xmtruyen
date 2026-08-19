import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { audioService, type AudioChapter } from '../services/audioService';

interface AudioPlayerContextType {
  playlist: AudioChapter[];
  currentChapter: AudioChapter | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLoading: boolean;
  setPlaylist: (chapters: AudioChapter[]) => void;
  playChapter: (chapter: AudioChapter) => void;
  playNext: () => void;
  playPrev: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<AudioChapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<AudioChapter | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Use a singleton Audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element once
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto play next if available
      playNext();
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update src when current chapter changes
  useEffect(() => {
    if (currentChapter && audioRef.current) {
      const audio = audioRef.current;
      const streamUrl = audioService.getStreamUrl(currentChapter.id);
      
      // Prevent reloading if it's the same URL
      if (audio.src !== streamUrl) {
        audio.src = streamUrl;
        audio.load();
        audio.play().catch(e => console.error("Error auto-playing:", e));
      }
    }
  }, [currentChapter]);

  const playChapter = (chapter: AudioChapter) => {
    setCurrentChapter(chapter);
  };

  const playNext = () => {
    if (!currentChapter || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(c => c.id === currentChapter.id);
    if (currentIndex >= 0 && currentIndex < playlist.length - 1) {
      playChapter(playlist[currentIndex + 1]);
    }
  };

  const playPrev = () => {
    if (!currentChapter || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(c => c.id === currentChapter.id);
    if (currentIndex > 0) {
      playChapter(playlist[currentIndex - 1]);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentChapter) return;
    
    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => console.error(e));
    } else {
      audioRef.current.pause();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (val: number) => {
    if (audioRef.current) {
      audioRef.current.volume = val;
      setVolumeState(val);
    }
  };

  const setPlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRateState(rate);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playlist,
        currentChapter,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackRate,
        isLoading,
        setPlaylist,
        playChapter,
        playNext,
        playPrev,
        togglePlayPause,
        seek,
        setVolume,
        setPlaybackRate
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
