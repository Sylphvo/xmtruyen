import React, { useState } from 'react';
import { Settings, Moon, Sun, Type, Monitor } from 'lucide-react';
import './ReaderSettings.css';

interface ReaderPreferences {
    theme: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    contrast: number;
    enableBreakReminder: boolean;
    breakReminderIntervalMinutes: number;
}

interface Props {
    preferences: ReaderPreferences;
    onUpdate: (prefs: ReaderPreferences) => void;
    onClose: () => void;
}

export const ReaderSettings: React.FC<Props> = ({ preferences, onUpdate, onClose }) => {
    const [prefs, setPrefs] = useState<ReaderPreferences>(preferences);

    const handleChange = (key: keyof ReaderPreferences, value: any) => {
        const newPrefs = { ...prefs, [key]: value };
        setPrefs(newPrefs);
        onUpdate(newPrefs); // real-time preview
    };

    return (
        <div className="reader-settings-overlay" onClick={onClose}>
            <div className="reader-settings-panel" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <h3><Settings size={20} /> Tùy Chỉnh Đọc</h3>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>
                
                <div className="settings-body">
                    {/* Theme */}
                    <div className="setting-group">
                        <label>Giao Diện (Theme)</label>
                        <div className="theme-options">
                            <button 
                                className={`theme-btn ${prefs.theme === 'light' ? 'active' : ''}`}
                                onClick={() => handleChange('theme', 'light')}
                            >
                                <Sun size={18} /> Sáng
                            </button>
                            <button 
                                className={`theme-btn ${prefs.theme === 'sepia' ? 'active' : ''}`}
                                onClick={() => handleChange('theme', 'sepia')}
                                style={{ backgroundColor: '#f4ecd8', color: '#5b4636' }}
                            >
                                Ngả vàng
                            </button>
                            <button 
                                className={`theme-btn ${prefs.theme === 'dark' ? 'active' : ''}`}
                                onClick={() => handleChange('theme', 'dark')}
                            >
                                <Moon size={18} /> Tối
                            </button>
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="setting-group">
                        <label>Font Chữ</label>
                        <select 
                            value={prefs.fontFamily} 
                            onChange={(e) => handleChange('fontFamily', e.target.value)}
                        >
                            <option value="Arial, sans-serif">Arial (Không chân)</option>
                            <option value="'Times New Roman', serif">Times New Roman (Có chân)</option>
                            <option value="Bookerly, serif">Bookerly (Chuyên đọc sách)</option>
                            <option value="'Noto Sans', sans-serif">Noto Sans</option>
                        </select>
                    </div>

                    {/* Font Size & Line Height */}
                    <div className="setting-row">
                        <div className="setting-group">
                            <label>Cỡ Chữ: {prefs.fontSize}px</label>
                            <input 
                                type="range" min="12" max="32" step="1" 
                                value={prefs.fontSize} 
                                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))} 
                            />
                        </div>
                        <div className="setting-group">
                            <label>Khoảng cách dòng: {prefs.lineHeight}</label>
                            <input 
                                type="range" min="1.0" max="2.5" step="0.1" 
                                value={prefs.lineHeight} 
                                onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))} 
                            />
                        </div>
                    </div>

                    {/* Contrast */}
                    <div className="setting-group">
                        <label>Độ Tương Phản: {Math.round(prefs.contrast * 100)}%</label>
                        <input 
                            type="range" min="0.5" max="1.5" step="0.1" 
                            value={prefs.contrast} 
                            onChange={(e) => handleChange('contrast', parseFloat(e.target.value))} 
                        />
                    </div>

                    {/* Break Reminder */}
                    <div className="setting-group break-reminder-group">
                        <label className="checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={prefs.enableBreakReminder}
                                onChange={(e) => handleChange('enableBreakReminder', e.target.checked)}
                            />
                            Bật Nhắc Nghỉ Mắt (Break Reminder)
                        </label>
                        {prefs.enableBreakReminder && (
                            <div className="reminder-interval">
                                Nhắc mỗi: 
                                <select 
                                    value={prefs.breakReminderIntervalMinutes}
                                    onChange={(e) => handleChange('breakReminderIntervalMinutes', parseInt(e.target.value))}
                                >
                                    <option value={30}>30 phút</option>
                                    <option value={45}>45 phút</option>
                                    <option value={60}>60 phút</option>
                                    <option value={90}>90 phút</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
