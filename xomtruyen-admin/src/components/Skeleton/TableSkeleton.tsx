import React from 'react';
import { SkeletonBone } from './SkeletonBone';

interface TableSkeletonProps {
    /** Số dòng skeleton */
    rows?: number;
    /** Số cột */
    columns?: number;
    /** Có checkbox column không */
    hasCheckbox?: boolean;
    /** Có image column không */
    hasImage?: boolean;
    /** Có action column không */
    hasActions?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 5,
    columns = 6,
    hasCheckbox = true,
    hasImage = true,
    hasActions = true,
}) => {
    return (
        <div className="table-skeleton" aria-busy="true" aria-label="Đang tải bảng dữ liệu...">
            {/* Header skeleton */}
            <div className="table-skeleton-header" style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--jira-border)' }}>
                {hasCheckbox && <SkeletonBone variant="rectangular" width={18} height={18} />}
                {hasImage && <SkeletonBone variant="rounded" width={48} height={18} />}
                {Array.from({ length: columns }, (_, i) => (
                    <SkeletonBone key={i} variant="text" width={`${60 + Math.random() * 40}%`} height={14} style={{ flex: 1 }} />
                ))}
            </div>

            {/* Row skeletons */}
            {Array.from({ length: rows }, (_, rowIdx) => (
                <div key={rowIdx} className="table-skeleton-row"
                     style={{ display: 'flex', gap: 12, padding: '14px 16px', alignItems: 'center', borderBottom: '1px solid var(--jira-border, #2a2a3e)' }}>
                    {hasCheckbox && <SkeletonBone variant="rectangular" width={18} height={18} />}
                    {hasImage && <SkeletonBone variant="rounded" width={48} height={48} />}
                    <div style={{ flex: 2 }}>
                        <SkeletonBone variant="text" width={`${50 + Math.random() * 40}%`} height={14} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <SkeletonBone variant="text" width={`${40 + Math.random() * 30}%`} height={14} />
                    </div>
                    {Array.from({ length: columns - 2 }, (_, i) => (
                        <div key={i} style={{ flex: 1 }}>
                            <SkeletonBone variant="text" width={`${30 + Math.random() * 50}%`} height={14} />
                        </div>
                    ))}
                    {hasActions && (
                        <div style={{ display: 'flex', gap: 6, flex: 0, minWidth: 120 }}>
                            <SkeletonBone variant="rounded" width={60} height={28} />
                            <SkeletonBone variant="rounded" width={40} height={28} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
