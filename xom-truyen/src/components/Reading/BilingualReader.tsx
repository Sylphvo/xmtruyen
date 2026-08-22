import React, { useState } from 'react';
import './BilingualReader.css';

interface Paragraph {
    id: string;
    original: string; // e.g., English
    translated: string; // e.g., Vietnamese
}

interface Props {
    title: string;
    paragraphs: Paragraph[];
    onWordClick?: (word: string) => void;
}

export const BilingualReader: React.FC<Props> = ({ title, paragraphs, onWordClick }) => {
    const [viewMode, setViewMode] = useState<'side-by-side' | 'interleaved' | 'original-only' | 'translated-only'>('side-by-side');

    const handleWordClick = (word: string) => {
        // Clean punctuation
        const cleanWord = word.replace(/[.,!?;:"'()[\]{}]/g, '').toLowerCase();
        if (cleanWord && onWordClick) {
            onWordClick(cleanWord);
        }
    };

    const renderText = (text: string, clickable: boolean = false) => {
        if (!clickable) return text;
        return text.split(' ').map((word, idx) => (
            <span key={idx} className="clickable-word" onClick={() => handleWordClick(word)}>
                {word}{' '}
            </span>
        ));
    };

    return (
        <div className="bilingual-reader-container">
            <div className="bilingual-controls">
                <button className={viewMode === 'side-by-side' ? 'active' : ''} onClick={() => setViewMode('side-by-side')}>Song song</button>
                <button className={viewMode === 'interleaved' ? 'active' : ''} onClick={() => setViewMode('interleaved')}>Xen kẽ</button>
                <button className={viewMode === 'original-only' ? 'active' : ''} onClick={() => setViewMode('original-only')}>Chỉ bản gốc</button>
                <button className={viewMode === 'translated-only' ? 'active' : ''} onClick={() => setViewMode('translated-only')}>Chỉ bản dịch</button>
            </div>

            <h1 className="bilingual-title">{title}</h1>

            <div className={`bilingual-content mode-${viewMode}`}>
                {paragraphs.map((p) => (
                    <div key={p.id} className="bilingual-paragraph-pair">
                        {(viewMode === 'side-by-side' || viewMode === 'interleaved' || viewMode === 'original-only') && (
                            <div className="text-original">
                                {renderText(p.original, true)}
                            </div>
                        )}
                        {(viewMode === 'side-by-side' || viewMode === 'interleaved' || viewMode === 'translated-only') && (
                            <div className="text-translated">
                                {p.translated}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
