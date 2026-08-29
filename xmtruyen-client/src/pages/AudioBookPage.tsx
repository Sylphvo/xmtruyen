import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { audioService } from '../services/audioService';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { AudioPlayer } from '../components/AudioPlayer/AudioPlayer';
import { ChapterList } from '../components/AudioPlayer/ChapterList';
import { ArrowLeft } from 'lucide-react';

export default function AudioBookPage() {
  const { publicationId } = useParams<{ publicationId: string }>();
  const navigate = useNavigate();
  const { setPlaylist, playChapter, currentChapter, playlist } = useAudioPlayer();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!publicationId) return;
      try {
        setLoading(true);
        // Ensure this doesn't clear the current playing if it's the SAME audiobook.
        // We only fetch and reset if the playlist belongs to a different book.
        // For simplicity, we just fetch anyway.
        const chapters = await audioService.getAudioChapters(publicationId);
        setPlaylist(chapters);
        
        // Auto-play the first chapter if nothing is playing
        if (chapters.length > 0 && (!currentChapter || currentChapter.publicationId !== publicationId)) {
          // playChapter(chapters[0]); // Optional: we might not want to auto-start until they click
        }
      } catch (error) {
        console.error("Failed to load audio chapters", error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for API to resolve
    fetchChapters();
  }, [publicationId]); // intentionally omitting some deps to avoid infinite loops

  return (
    <div className="container-fluid py-4" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <button 
        className="btn btn-link text-white text-decoration-none mb-3 d-flex align-items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} /> Quay lại
      </button>
      
      {loading ? (
        <div className="d-flex justify-content-center mt-5">
           <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : (
        <div className="row h-100 g-4 pb-5">
          {/* Left Column: Player (takes more space on desktop) */}
          <div className="col-12 col-lg-7 h-100 pb-4">
            <AudioPlayer />
          </div>

          {/* Right Column: Playlist */}
          <div className="col-12 col-lg-5 h-100 pb-4">
            <ChapterList />
          </div>
        </div>
      )}
    </div>
  );
}
