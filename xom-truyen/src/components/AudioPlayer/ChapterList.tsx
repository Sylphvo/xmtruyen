import React from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Play, Lock } from 'lucide-react';
import { ACCENT } from '../../constants';

export const ChapterList: React.FC = () => {
  const { playlist, currentChapter, playChapter, isPlaying } = useAudioPlayer();

  if (playlist.length === 0) {
    return (
      <div className="text-white-50 p-4 text-center">
        Đang tải danh sách chương...
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden' }}>
      <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-white">Danh sách chương</h5>
        <span className="badge bg-secondary">{playlist.length} chương</span>
      </div>
      
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '600px' }}>
        <ul className="list-group list-group-flush">
          {playlist.map((chapter) => {
            const isActive = currentChapter?.id === chapter.id;
            
            return (
              <li 
                key={chapter.id}
                className={`list-group-item d-flex align-items-center justify-content-between p-3 border-secondary border-bottom`}
                style={{ 
                  backgroundColor: isActive ? 'rgba(232, 76, 61, 0.1)' : 'transparent',
                  cursor: chapter.isLocked ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onClick={() => !chapter.isLocked && playChapter(chapter)}
              >
                <div className="d-flex flex-column" style={{ maxWidth: '75%' }}>
                  <span 
                    className={`fw-semibold text-truncate ${isActive ? 'text-danger' : 'text-white'}`}
                  >
                    {chapter.title}
                  </span>
                  <div className="d-flex gap-3 text-white-50 small mt-1">
                    <span>⏱ {Math.floor(chapter.duration / 60)} phút</span>
                    {chapter.isLocked && (
                      <span className="text-warning"><Lock size={12} className="me-1"/> {chapter.coinPrice} xu</span>
                    )}
                  </div>
                </div>

                <div>
                  {isActive && isPlaying ? (
                    <div className="d-flex gap-1 align-items-end" style={{ height: '20px' }}>
                      <div className="bg-danger" style={{ width: '4px', height: '100%', animation: 'bounce 1s infinite' }}></div>
                      <div className="bg-danger" style={{ width: '4px', height: '60%', animation: 'bounce 1s infinite 0.2s' }}></div>
                      <div className="bg-danger" style={{ width: '4px', height: '80%', animation: 'bounce 1s infinite 0.4s' }}></div>
                    </div>
                  ) : isActive ? (
                    <Play size={20} color={ACCENT} fill={ACCENT} />
                  ) : chapter.isLocked ? (
                    <button className="btn btn-sm btn-outline-warning rounded-pill py-0 px-2" style={{ fontSize: '11px' }}>Mở khóa</button>
                  ) : (
                    <Play size={20} className="text-white-50" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};
