import React from 'react';
import { SkeletonBone } from './SkeletonBone';

interface FormSkeletonProps {
    fields?: number;
    hasImage?: boolean;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({ fields = 6, hasImage = false }) => {
    return (
        <div className="form-skeleton" aria-busy="true" style={{ padding: 24 }}>
            {hasImage && (
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <SkeletonBone variant="rounded" width={120} height={160} style={{ margin: '0 auto' }} />
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {Array.from({ length: fields }, (_, i) => (
                    <div key={i}>
                        <SkeletonBone variant="text" width="30%" height={12} style={{ marginBottom: 8 }} />
                        <SkeletonBone variant="rounded" width="100%" height={38} />
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <SkeletonBone variant="rounded" width={80} height={36} />
                <SkeletonBone variant="rounded" width={100} height={36} />
            </div>
        </div>
    );
};
