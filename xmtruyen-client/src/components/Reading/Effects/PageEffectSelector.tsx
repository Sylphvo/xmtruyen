import React from 'react';
import { type PageEffect } from './PageEffectWrapper';

const EFFECTS: { id: PageEffect; icon: string; name: string; description: string }[] = [
    { id: 'magazine', icon: '📰', name: 'Magazine', description: 'Lật trang 3D realistic' },
    { id: 'book', icon: '📕', name: 'Book', description: '2 trang spread + spine' },
    { id: 'slider', icon: '🎞️', name: 'Slider', description: 'Trượt ngang smooth' },
    { id: 'coverflow', icon: '💿', name: 'Coverflow', description: '3D xoay perspective' },
    { id: 'notebook', icon: '📒', name: 'Notebook', description: 'Lật trên xuống' },
    { id: 'cards', icon: '🃏', name: 'Cards', description: 'Xếp chồng swipe' },
    { id: 'onepage', icon: '📄', name: 'One Page', description: 'Cuộn/fade đơn giản' },
];

interface Props {
    selected: PageEffect;
    onChange: (effect: PageEffect) => void;
    themeStyles?: any;
}

export const PageEffectSelector: React.FC<Props> = ({ selected, onChange, themeStyles }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {EFFECTS.map(effect => (
                <button
                    key={effect.id}
                    onClick={() => onChange(effect.id)}
                    title={effect.description}
                    style={{
                        padding: '12px 4px', 
                        border: selected === effect.id ? '2px solid #00d4ff' : `1px solid ${themeStyles?.border || '#e5e7eb'}`,
                        borderRadius: '10px', 
                        background: selected === effect.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                        color: themeStyles?.panelText || '#333',
                        cursor: 'pointer', 
                        textAlign: 'center', 
                        transition: 'all 200ms ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{effect.icon}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600 }}>{effect.name}</div>
                </button>
            ))}
        </div>
    );
};
