import React, { useState, useEffect } from 'react';
import { Volume2, X, Bookmark } from 'lucide-react';
import './DictionaryPopup.css';

interface Props {
    word: string;
    onClose: () => void;
}

interface DictResult {
    word: string;
    phonetic: string;
    pos: string;
    meaning: string;
    examples: string[];
}

export const DictionaryPopup: React.FC<Props> = ({ word, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<DictResult | null>(null);

    useEffect(() => {
        // Mock API call to dictionary service
        const fetchMeaning = async () => {
            setLoading(true);
            
            // Simulate network latency
            await new Promise(res => setTimeout(res, 500));
            
            // Mock result
            setResult({
                word: word,
                phonetic: `/${word}/`,
                pos: 'noun',
                meaning: `Nghĩa tiếng Việt của từ "${word}" (Mock Data)`,
                examples: [
                    `This is an example using ${word}.`,
                    `Một ví dụ khác về ${word}.`
                ]
            });
            setLoading(false);
        };

        if (word) {
            fetchMeaning();
        }
    }, [word]);

    const playAudio = () => {
        const msg = new SpeechSynthesisUtterance(word);
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);
    };

    return (
        <div className="dict-popup-overlay" onClick={onClose}>
            <div className="dict-popup-content" onClick={e => e.stopPropagation()}>
                <button className="dict-close" onClick={onClose}><X size={20} /></button>
                
                {loading ? (
                    <div className="dict-loading">Đang tra từ...</div>
                ) : result ? (
                    <div className="dict-result">
                        <div className="dict-header">
                            <div className="dict-word-group">
                                <h2>{result.word}</h2>
                                <span className="dict-phonetic">{result.phonetic}</span>
                            </div>
                            <div className="dict-actions">
                                <button className="dict-audio-btn" onClick={playAudio} title="Nghe phát âm">
                                    <Volume2 size={20} />
                                </button>
                                <button className="dict-save-btn" title="Lưu vào Sổ tay từ vựng">
                                    <Bookmark size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="dict-pos">{result.pos}</div>
                        <div className="dict-meaning">{result.meaning}</div>
                        
                        <div className="dict-examples">
                            <h4>Ví dụ:</h4>
                            <ul>
                                {result.examples.map((ex, i) => (
                                    <li key={i}>{ex}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="dict-error">Không tìm thấy từ này.</div>
                )}
            </div>
        </div>
    );
};
