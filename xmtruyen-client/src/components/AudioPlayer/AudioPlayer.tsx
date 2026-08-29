import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, FastForward } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { ACCENT } from '../../constants';

// Format time in seconds to mm:ss
const formatTime = (time: number) => {
  if (isNaN(time)) return '00:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: React.FC = () => {
  const { 
    currentChapter, 
    isPlaying, 
    togglePlayPause, 
    playNext, 
    playPrev,
    currentTime, 
    duration,
    seek,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    isLoading
  } = useAudioPlayer();

  if (!currentChapter) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-dark rounded-4" style={{ height: '400px' }}>
        <p className="text-white-50">Vui lòng chọn một chương sách nói để bắt đầu</p>
      </div>
    );
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const skipTime = (amount: number) => {
    let newTime = currentTime + amount;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    seek(newTime);
  };

  const toggleMute = () => {
    if (volume > 0) setVolume(0);
    else setVolume(1);
  };

  const togglePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  return (
    <div className="bg-dark rounded-4 p-4 text-white shadow-lg d-flex flex-column align-items-center w-100 h-100">
      
      {/* Cover Art / Audio Visualizer Placeholder */}
      <div 
        className="rounded-circle d-flex justify-content-center align-items-center mb-4 shadow position-relative"
        style={{ 
          width: '200px', 
          height: '200px', 
          background: 'linear-gradient(135deg, #1c2340, #2a3a6e)',
          border: `4px solid ${ACCENT}`,
          animation: isPlaying ? 'spin 10s linear infinite' : 'none'
        }}
      >
        <span style={{ fontSize: '4rem' }}>🎧</span>
        {isLoading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 rounded-circle d-flex justify-content-center align-items-center">
             <div className="spinner-border text-light" role="status"></div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .custom-range::-webkit-slider-thumb {
          background: ${ACCENT};
        }
      `}</style>

      {/* Track Info */}
      <h3 className="h4 fw-bold text-center mb-1 text-truncate w-100">{currentChapter.title}</h3>
      <p className="text-white-50 text-center mb-4">Sách Nói - Xóm Truyện</p>

      {/* Scrubber */}
      <div className="w-100 mb-4 px-2">
        <input 
          type="range" 
          className="form-range custom-range w-100" 
          min={0} 
          max={duration || 100} 
          value={currentTime} 
          onChange={handleSeek} 
          disabled={!duration}
        />
        <div className="d-flex justify-content-between text-white-50 small mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="d-flex align-items-center justify-content-center gap-4 mb-4">
        <button className="btn btn-link text-white-50 hover-text-white p-0 border-0" onClick={() => skipTime(-15)} title="Lùi 15s">
           <SkipBack size={24} />
           <span className="small d-block" style={{fontSize: '10px'}}>-15s</span>
        </button>

        <button className="btn btn-link text-white p-0 border-0" onClick={playPrev} title="Chương trước">
          <SkipBack size={28} fill="currentColor" />
        </button>
        
        <button 
          className="btn text-white rounded-circle d-flex align-items-center justify-content-center" 
          style={{ width: '64px', height: '64px', backgroundColor: ACCENT }}
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
        </button>

        <button className="btn btn-link text-white p-0 border-0" onClick={playNext} title="Chương tiếp theo">
          <SkipForward size={28} fill="currentColor" />
        </button>

        <button className="btn btn-link text-white-50 hover-text-white p-0 border-0" onClick={() => skipTime(15)} title="Tiến 15s">
           <SkipForward size={24} />
           <span className="small d-block" style={{fontSize: '10px'}}>+15s</span>
        </button>
      </div>

      {/* Secondary Controls (Volume, Speed) */}
      <div className="d-flex align-items-center justify-content-between w-100 mt-auto pt-3 border-top border-secondary">
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-link text-white-50 p-0" onClick={toggleMute}>
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            className="form-range" 
            min={0} max={1} step={0.01} 
            value={volume} 
            onChange={handleVolumeChange} 
            style={{ width: '80px', height: '4px' }}
          />
        </div>
        
        <button 
          className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
          style={{ fontSize: '12px' }}
          onClick={togglePlaybackRate}
        >
          <FastForward size={14} /> {playbackRate}x
        </button>
      </div>
    </div>
  );
};
