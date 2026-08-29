import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Play, Pause, X, SkipForward } from 'lucide-react';
import { ProgressBar } from 'react-bootstrap';
import { ACCENT } from '../../constants';

export const MiniPlayer: React.FC = () => {
  const { currentChapter, isPlaying, togglePlayPause, playNext, currentTime, duration } = useAudioPlayer();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide if no chapter is playing or if we are already on the audiobook page
  if (!currentChapter) return null;
  if (location.pathname.startsWith('/audiobook/')) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="position-fixed bottom-0 start-0 end-0 bg-dark text-white p-2 shadow-lg z-3"
      style={{ 
        height: '60px', 
        borderTop: `2px solid ${ACCENT}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        cursor: 'pointer'
      }}
      onClick={() => navigate(`/audiobook/${currentChapter.publicationId}`)}
    >
      {/* Track Info */}
      <div className="d-flex align-items-center gap-3" style={{ flex: 1, overflow: 'hidden' }}>
        <div 
          className="rounded d-flex justify-content-center align-items-center"
          style={{ width: '40px', height: '40px', backgroundColor: '#333' }}
        >
          🎧
        </div>
        <div className="d-flex flex-column text-truncate">
          <span className="fw-semibold text-truncate" style={{ fontSize: '14px' }}>
            {currentChapter.title}
          </span>
          <span className="text-white-50" style={{ fontSize: '12px' }}>Đang phát Sách Nói</span>
        </div>
      </div>

      {/* Controls */}
      <div className="d-flex align-items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button 
          className="btn btn-link text-white p-0 border-0"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        <button 
          className="btn btn-link text-white-50 p-0 border-0"
          onClick={playNext}
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Mini Progress Bar */}
      <div 
        className="position-absolute start-0 end-0 top-0" 
        style={{ height: '2px', transform: 'translateY(-2px)' }}
      >
        <ProgressBar 
          now={progressPercent} 
          variant="danger" // Using bootstrap danger to match ACCENT closely, or we can use custom styles
          style={{ height: '2px', borderRadius: 0, backgroundColor: 'transparent' }} 
        />
      </div>
    </div>
  );
};
