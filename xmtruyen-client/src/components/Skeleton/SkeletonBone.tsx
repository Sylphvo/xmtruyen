import React from 'react';
import './Skeleton.scss';

interface SkeletonBoneProps {
    /** Chiá»u rá»™ng (px, %, hoáº·c 'full') */
    width?: string | number;
    /** Chiá»u cao (px) */
    height?: string | number;
    /** HÃ¬nh dáº¡ng */
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    /** Class bá»• sung */
    className?: string;
    /** Inline style bá»• sung */
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
            className={skeleton-bone  }
            style={{
                width: typeof width === 'number' ? ${width}px : width,
                height: typeof height === 'number' ? ${height}px : height,
                ...style
            }}
            aria-hidden="true"
            role="presentation"
        />
    );
};
