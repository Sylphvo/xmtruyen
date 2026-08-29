import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Chapter {
    id: string;
    chapterNumber: number;
    title: string;
    isLocked?: boolean;
    updatedAt?: string;
    publicationId: string;
}

interface Props {
    chapters: Chapter[];
    currentChapter?: number;
    isComic?: boolean;
}

/**
 * Danh sách chương với:
 * - Ban đầu hiện 10 chương
 * - "Xem thêm" → expand smooth (max-height transition)
 * - Highlight chương đang đọc (pulse animation)
 * - Locked chapters có icon 🔒 + opacity thấp hơn
 */
export const AnimatedChapterList: React.FC<Props> = ({ chapters, currentChapter, isComic = false }) => {
    const [expanded, setExpanded] = useState(false);
    const displayChapters = expanded ? chapters : chapters.slice(0, 10);

    return (
        <div>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                Danh sách chương ({chapters.length})
                {chapters.length > 10 && (
                    <button onClick={() => setExpanded(!expanded)}
                        style={{ fontSize: '14px', color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer' }}>
                        {expanded ? 'Thu gọn ▲' : `Xem tất cả ${chapters.length} chương ▼`}
                    </button>
                )}
            </h3>

            <div style={{
                maxHeight: expanded ? `${chapters.length * 52}px` : '520px',
                overflow: 'hidden',
                transition: 'max-height 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                {displayChapters.map((ch, idx) => (
                    <Link
                        key={ch.id}
                        to={`/book/${ch.publicationId}/read`}
                        state={{ isComic }}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px 16px', borderBottom: '1px solid var(--border-color, #2a2a3e)',
                            backgroundColor: ch.chapterNumber === currentChapter ? 'var(--highlight-bg, rgba(0, 212, 255, 0.1))' : 'transparent',
                            transition: 'background-color 200ms ease',
                            opacity: ch.isLocked ? 0.6 : 1,
                            // Stagger enter animation using inline style or class
                            animation: `slideInLeft 300ms ${idx * 30}ms both`,
                            cursor: 'pointer'
                        }} className="hover-lift">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {ch.isLocked && <Lock size={14} color="#f59e0b" />} 
                                <span style={{ fontWeight: ch.chapterNumber === currentChapter ? 'bold' : 'normal', color: ch.chapterNumber === currentChapter ? '#00d4ff' : 'inherit' }}>
                                    Chương {ch.chapterNumber}: {ch.title}
                                </span>
                            </span>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{ch.updatedAt || 'Vừa xong'}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
