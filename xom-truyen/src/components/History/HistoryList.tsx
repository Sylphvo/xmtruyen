import React, { useEffect, useState } from 'react';
import HistoryItem, { type HistoryRecord } from './HistoryItem';

interface Props {
    items: HistoryRecord[];
    onRemoveItem: (id: number) => void;
}

export const HistoryList: React.FC<Props> = ({ items, onRemoveItem }) => {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const [removingId, setRemovingId] = useState<number | null>(null);

    // Stagger animation: mỗi item xuất hiện cách nhau 100ms
    useEffect(() => {
        items.forEach((item, index) => {
            setTimeout(() => {
                setVisibleItems(prev => new Set([...prev, item.id]));
            }, index * 100);
        });
    }, [items]);

    const handleRemove = (id: number) => {
        setRemovingId(id);
        // Đợi animation exit xong mới xóa thật (300ms matches CSS transition)
        setTimeout(() => {
            onRemoveItem(id);
            setRemovingId(null);
        }, 300);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map(item => {
                const isRemoving = removingId === item.id;
                const isVisible = visibleItems.has(item.id);

                return (
                    <div
                        key={item.id}
                        style={{
                            opacity: isRemoving ? 0 : isVisible ? 1 : 0,
                            transform: isRemoving
                                ? 'translateX(100px) scale(0.95)'
                                : isVisible ? 'translateY(0)' : 'translateY(30px)',
                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                            maxHeight: isRemoving ? '0px' : '500px',
                            overflow: 'hidden',
                        }}
                    >
                        <HistoryItem 
                            record={item} 
                            onRemove={handleRemove} 
                        />
                    </div>
                );
            })}
        </div>
    );
};
