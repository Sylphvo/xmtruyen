import React from 'react';
import './Skeleton.scss';

interface SkeletonBoneProps {
    /** Chiều rộng (px, %, hoặc 'full') */
    width?: string | number;
    /** Chiều cao (px) */
    height?: string | number;
    /** Hình dạng */
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    /** Class bổ sung */
    className?: string;
    /** Inline style bổ sung */
    style?: React.CSSProperties;
}

export const SkeletonBone: React.FC<SkeletonBoneProps> = ({
    width = '100%',
    height = 16,
    variant = 'text',
    className = '',
    style = {}
}) => {
    const variantClass = {
        text: 'skeleton-text',
        circular: 'skeleton-circular',
        rectangular: 'skeleton-rectangular',
        rounded: 'skeleton-rounded',
    }[variant];

    return (
        <div
            className={`skeleton-bone ${variantClass} ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                ...style
            }}
            aria-hidden="true"
            role="presentation"
        />
    );
};
