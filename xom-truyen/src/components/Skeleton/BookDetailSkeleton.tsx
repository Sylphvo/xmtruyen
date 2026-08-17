import React from 'react';
import { SkeletonBone } from './SkeletonBone';

export const BookDetailSkeleton: React.FC = () => {
    return (
        <div className="book-detail-skeleton" style={{ padding: '24px 0' }}>
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                {/* Cover */}
                <SkeletonBone variant="rounded" width={200} height={280} style={{ flexShrink: 0 }} />
                {/* Info */}
                <div style={{ flex: 1 }}>
                    <SkeletonBone variant="text" width="70%" height={24} style={{ marginBottom: 16 }} />
                    <SkeletonBone variant="text" width="40%" height={14} style={{ marginBottom: 12 }} />
                    <SkeletonBone variant="text" width="30%" height={14} style={{ marginBottom: 20 }} />
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        <SkeletonBone variant="rounded" width={60} height={24} />
                        <SkeletonBone variant="rounded" width={80} height={24} />
                        <SkeletonBone variant="rounded" width={70} height={24} />
                    </div>
                    {/* Description */}
                    <SkeletonBone variant="text" width="100%" height={12} style={{ marginBottom: 8 }} />
                    <SkeletonBone variant="text" width="100%" height={12} style={{ marginBottom: 8 }} />
                    <SkeletonBone variant="text" width="60%" height={12} style={{ marginBottom: 20 }} />
                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <SkeletonBone variant="rounded" width={140} height={44} />
                        <SkeletonBone variant="rounded" width={120} height={44} />
                    </div>
                </div>
            </div>
            {/* Chapter List */}
            <SkeletonBone variant="text" width="20%" height={18} style={{ marginBottom: 16 }} />
            {Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #2a2a3e' }}>
                    <SkeletonBone variant="text" width={${40 + Math.random() * 30}%} height={14} />
                    <SkeletonBone variant="text" width={60} height={14} />
                </div>
            ))}
        </div>
    );
};
