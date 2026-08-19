import React, { useState, useEffect } from 'react';
import { ArrowUp, Sun, Moon, Volume2 } from 'lucide-react';

interface Props {
    onToggleTheme: () => void;
    currentTheme: 'light' | 'dark' | 'sepia';
    onToggleTTS?: () => void;
}

export const FloatingActions: React.FC<Props> = ({ onToggleTheme, currentTheme, onToggleTTS }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            // Show back to top if scrolled past 30% of the document or 500px, whichever is smaller
            const threshold = Math.min((docHeight * 0.3), 500);
            
            if (currentScrollY > threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 40,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            pointerEvents: isVisible ? 'auto' : 'none',
            transition: 'opacity 300ms ease, transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            {onToggleTTS && (
                <button 
                    onClick={onToggleTTS}
                    className="hover-lift"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--panel-bg, #1a1a2e)',
                        color: 'var(--text-color, #e0e0e0)',
                        border: '1px solid var(--border-color, #2a2a3e)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    title="Đọc văn bản (TTS)"
                >
                    <Volume2 size={18} />
                </button>
            )}
            
            <button 
                onClick={onToggleTheme}
                className="hover-lift"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--panel-bg, #1a1a2e)',
                    color: 'var(--text-color, #e0e0e0)',
                    border: '1px solid var(--border-color, #2a2a3e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                title="Đổi giao diện"
            >
                {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
                onClick={scrollToTop}
                className="hover-lift"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(33, 150, 243, 0.3)'
                }}
                title="Lên đầu trang"
            >
                <ArrowUp size={20} />
            </button>
        </div>
    );
};
