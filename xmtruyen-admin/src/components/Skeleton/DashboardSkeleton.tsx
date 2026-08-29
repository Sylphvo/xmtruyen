import React from 'react';
import { SkeletonBone } from './SkeletonBone';

export const DashboardSkeleton: React.FC = () => {
    return (
        <div className="dashboard-skeleton" aria-busy="true">
            {/* Stat Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 }}>
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} style={{ padding: 20, background: 'var(--jira-card-bg, #1a1a2e)', borderRadius: 12, border: '1px solid var(--jira-border)' }}>
                        <SkeletonBone variant="text" width="40%" height={12} style={{ marginBottom: 12 }} />
                        <SkeletonBone variant="text" width="60%" height={28} style={{ marginBottom: 8 }} />
                        <SkeletonBone variant="text" width="30%" height={12} />
                    </div>
                ))}
            </div>

            {/* Chart Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div style={{ padding: 20, background: 'var(--jira-card-bg, #1a1a2e)', borderRadius: 12, border: '1px solid var(--jira-border)' }}>
                    <SkeletonBone variant="text" width="30%" height={18} style={{ marginBottom: 20 }} />
                    <SkeletonBone variant="rounded" width="100%" height={250} />
                </div>
                <div style={{ padding: 20, background: 'var(--jira-card-bg, #1a1a2e)', borderRadius: 12, border: '1px solid var(--jira-border)' }}>
                    <SkeletonBone variant="text" width="50%" height={18} style={{ marginBottom: 20 }} />
                    <SkeletonBone variant="circular" width={180} height={180} style={{ margin: '0 auto' }} />
                </div>
            </div>
        </div>
    );
};
