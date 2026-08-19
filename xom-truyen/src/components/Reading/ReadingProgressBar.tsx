import React, { useState, useEffect, useRef } from 'react';

interface Props {
    chapterId: string;
    onProgressChange?: (percent: number) => void;
}

/**
 * Thanh tiến độ đọc — sticky top 3px.
 * Tự động tính % dựa trên scroll position.
 * Auto-save mỗi 10 giây + resume khi quay lại.
 */
export const ReadingProgressBar: React.FC<Props> = ({ chapterId, onProgressChange }) => {
    const [progress, setProgress] = useState(0);
    const saveTimerRef = useRef<number>();

    // Tính % scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
            setProgress(percent);
            onProgressChange?.(percent);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [onProgressChange]);

    // Auto-save mỗi 10 giây
    useEffect(() => {
        saveTimerRef.current = window.setInterval(() => {
            if (progress > 0) {
                localStorage.setItem(`reading_pos_${chapterId}`, String(progress));
                // Mock API call to save progress
                // fetch('/api/reading/progress', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ chapterId, scrollPercent: progress }),
                //     keepalive: true
                // }).catch(() => {});
            }
        }, 10000);

        return () => clearInterval(saveTimerRef.current);
    }, [chapterId, progress]);

    // Resume position khi mount
    useEffect(() => {
        const saved = localStorage.getItem(`reading_pos_${chapterId}`);
        if (saved) {
            const percent = parseFloat(saved);
            if (percent > 5) { // Chỉ resume nếu > 5%
                requestAnimationFrame(() => {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    window.scrollTo({ top: (percent / 100) * docHeight, behavior: 'smooth' });
                });
            }
        }
    }, [chapterId]);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            zIndex: 1000,
            overflow: 'hidden'
        }}>
            <div style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#2196f3',
                transition: 'width 100ms linear',
                borderRadius: '0 2px 2px 0'
            }} />
        </div>
    );
};
