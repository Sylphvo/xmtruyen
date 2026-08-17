import React from 'react';

interface SkeletonGroupProps {
    /** Số lượng skeleton items lặp lại */
    count?: number;
    /** Khoảng cách giữa các items */
    gap?: number;
    /** Layout direction */
    direction?: 'row' | 'column';
    /** Render function cho mỗi item */
    children: (index: number) => React.ReactNode;
    /** Class bổ sung */
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
            className={`skeleton-group ${className}`}
            style={{ display: 'flex', flexDirection: direction, gap: typeof gap === 'number' ? `${gap}px` : gap }}
            aria-busy="true"
            aria-label="Đang tải nội dung..."
        >
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="skeleton-group-item">
                    {children(i)}
                </div>
            ))}
        </div>
    );
};
