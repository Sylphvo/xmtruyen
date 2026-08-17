import React from 'react';
import { SkeletonBone } from './SkeletonBone';

export const BookCardSkeleton: React.FC = () => {
    return (
        <div className="book-card-skeleton" style={{ width: '100%' }}>
            {/* Cover Image */}
            <SkeletonBone variant="rounded" width="100%" height={200} style={{ marginBottom: 12 }} />
            {/* Title */}
            <SkeletonBone variant="text" width="80%" height={16} style={{ marginBottom: 8 }} />
            {/* Author */}
            <SkeletonBone variant="text" width="50%" height={12} style={{ marginBottom: 6 }} />
            {/* Meta (rating, views) */}
            <div style={{ display: 'flex', gap: 8 }}>
                <SkeletonBone variant="text" width={40} height={12} />
                <SkeletonBone variant="text" width={60} height={12} />
            </div>
        </div>
    );
};

/** Grid skeleton cho trang chá»§ â€” hiá»‡n 6 cards */
export const BookGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="book-grid-skeleton" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
            {Array.from({ length: count }, (_, i) => (
                <BookCardSkeleton key={i} />
            ))}
        </div>
    );
};
