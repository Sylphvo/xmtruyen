import React from 'react';

interface SkeletonGroupProps {
    /** Sá»‘ lÆ°á»£ng skeleton items láº·p láº¡i */
    count?: number;
    /** Khoáº£ng cÃ¡ch giá»¯a cÃ¡c items */
    gap?: number;
    /** Layout direction */
    direction?: 'row' | 'column';
    /** Render function cho má»—i item */
    children: (index: number) => React.ReactNode;
    /** Class bá»• sung */
    className?: string;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
    count = 3,
    gap = 16,
    direction = 'column',
    children,
    className = ''
}) => {
    return (
        <div
            className={skeleton-group }
            style={{ display: 'flex', flexDirection: direction, gap: ${gap}px }}
            aria-busy="true"
            aria-label="Äang táº£i ná»™i dung..."
        >
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="skeleton-group-item">
                    {children(i)}
                </div>
            ))}
        </div>
    );
};
