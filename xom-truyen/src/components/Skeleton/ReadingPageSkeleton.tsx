import React from 'react';
import { SkeletonBone } from './SkeletonBone';

/** Skeleton cho trang Ä‘á»c truyá»‡n chá»¯ */
export const TextReadingSkeleton: React.FC = () => (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
        <SkeletonBone variant="text" width="50%" height={22} style={{ margin: '0 auto 30px' }} />
        {Array.from({ length: 12 }, (_, i) => (
            <SkeletonBone key={i} variant="text" width={${70 + Math.random() * 30}%} height={14}
                style={{ marginBottom: 12 }} />
        ))}
    </div>
);

/** Skeleton cho trang Ä‘á»c truyá»‡n tranh */
export const ComicReadingSkeleton: React.FC = () => (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        {/* Navigation bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <SkeletonBone variant="rounded" width={100} height={32} />
            <SkeletonBone variant="text" width={80} height={14} />
            <SkeletonBone variant="rounded" width={100} height={32} />
        </div>
        {/* Comic pages */}
        <SkeletonBone variant="rounded" width="100%" height={500} style={{ marginBottom: 8 }} />
        <SkeletonBone variant="rounded" width="100%" height={500} style={{ marginBottom: 8 }} />
        <SkeletonBone variant="rounded" width="100%" height={300} />
    </div>
);
