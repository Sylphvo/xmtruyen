import React, { useState } from 'react';
import { Tablet, Smartphone, BookOpen, Search, Star } from 'lucide-react';
import './DeviceAdvisor.css';

interface DeviceRecommendation {
    name: string;
    type: 'ereader' | 'tablet' | 'phone';
    price: string;
    score: number;
    description: string;
    features: string[];
}

export const DeviceAdvisor: React.FC = () => {
    const [readTime, setReadTime] = useState<number>(2); // hours/day
    const [budget, setBudget] = useState<number>(3000000); // VND
    const [needsColor, setNeedsColor] = useState<boolean>(false);
    const [needsAudio, setNeedsAudio] = useState<boolean>(false);
    
    const [recommendations, setRecommendations] = useState<DeviceRecommendation[]>([]);

    const analyzeNeeds = () => {
        const results: DeviceRecommendation[] = [];

        // Simple rules engine
        if (!needsColor && readTime > 2) {
            results.push({
                name: 'Kindle Paperwhite / Kobo Clara',
                type: 'ereader',
                price: '3,000,000 - 4,000,000 VND',
                score: 95,
                description: 'Lựa chọn tối ưu cho việc đọc chữ (truyện chữ) nhiều giờ liền không mỏi mắt.',
                features: ['Màn hình E-ink 300ppi', 'Pin dùng vài tuần', 'Chống chói']
            });
        }

        if (needsColor || needsAudio) {
            results.push({
                name: 'iPad Mini / Lenovo Tab',
                type: 'tablet',
                price: '7,000,000 - 12,000,000 VND',
                score: 85,
                description: 'Phù hợp đọc truyện tranh màu (webtoon) và nghe sách nói audiobook.',
                features: ['Màn hình màu sống động', 'Hỗ trợ Bluetooth', 'Đa dụng']
            });
            
            if (budget > 6000000 && !needsColor) {
                results.push({
                    name: 'Onyx Boox (E-ink Android)',
                    type: 'ereader',
                    price: '6,000,000 - 10,000,000 VND',
                    score: 90,
                    description: 'E-ink chạy Android, cài được app đọc sách thoải mái, có loa nghe audiobook.',
                    features: ['Android OS', 'Nghe sách nói', 'Màn hình E-ink']
                });
            }
        }

        if (budget < 2000000) {
            results.push({
                name: 'Điện thoại màn hình lớn + App Xóm Truyện',
                type: 'phone',
                price: 'Có sẵn',
                score: 80,
                description: 'Tận dụng thiết bị có sẵn, kết hợp với chế độ "Sepia" hoặc "Dark Mode" của Xóm Truyện để giảm mỏi mắt.',
                features: ['Tiện lợi', 'Luôn mang theo']
            });
        }

        setRecommendations(results.sort((a, b) => b.score - a.score));
    };

    return (
        <div className="device-advisor-container">
            <div className="advisor-header">
                <h3><Search /> Tư Vấn Thiết Bị Đọc (Device Advisor)</h3>
                <p>Trả lời vài câu hỏi để Xóm Truyện gợi ý thiết bị đọc phù hợp nhất với bạn.</p>
            </div>

            <div className="advisor-form">
                <div className="form-group">
                    <label>Thời gian đọc mỗi ngày (Giờ): {readTime}</label>
                    <input 
                        type="range" min="1" max="10" step="1" 
                        value={readTime} onChange={e => setReadTime(parseInt(e.target.value))} 
                    />
                </div>
                
                <div className="form-group">
                    <label>Ngân sách dự kiến (VND): {(budget / 1000000).toFixed(1)} Triệu</label>
                    <input 
                        type="range" min="1000000" max="15000000" step="500000" 
                        value={budget} onChange={e => setBudget(parseInt(e.target.value))} 
                    />
                </div>

                <div className="form-checkboxes">
                    <label>
                        <input type="checkbox" checked={needsColor} onChange={e => setNeedsColor(e.target.checked)} />
                        Tôi hay đọc truyện tranh màu (Webtoon)
                    </label>
                    <label>
                        <input type="checkbox" checked={needsAudio} onChange={e => setNeedsAudio(e.target.checked)} />
                        Tôi thích nghe sách nói (Audiobook/TTS)
                    </label>
                </div>

                <button className="analyze-btn" onClick={analyzeNeeds}>Phân tích & Gợi ý</button>
            </div>

            {recommendations.length > 0 && (
                <div className="advisor-results">
                    <h4>Gợi ý hàng đầu cho bạn:</h4>
                    <div className="recommendation-list">
                        {recommendations.map((rec, idx) => (
                            <div key={idx} className="recommendation-card">
                                <div className="rec-icon">
                                    {rec.type === 'ereader' ? <BookOpen size={32} /> : 
                                     rec.type === 'tablet' ? <Tablet size={32} /> : <Smartphone size={32} />}
                                </div>
                                <div className="rec-content">
                                    <div className="rec-title">
                                        <h5>{rec.name}</h5>
                                        <span className="rec-score"><Star size={14} fill="#f39c12" color="#f39c12"/> {rec.score}</span>
                                    </div>
                                    <p className="rec-price">Khoảng: {rec.price}</p>
                                    <p className="rec-desc">{rec.description}</p>
                                    <div className="rec-features">
                                        {rec.features.map((f, i) => <span key={i} className="feature-tag">{f}</span>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
