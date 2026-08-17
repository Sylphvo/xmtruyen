import { IonSkeletonText } from '@ionic/react';
import React from 'react';

/** Skeleton cho list item sÃ¡ch trÃªn mobile */
export const MobileBookItemSkeleton: React.FC = () => (
    <div style={{ display: 'flex', gap: 12, padding: '12px 16px' }}>
        <IonSkeletonText animated style={{ width: 60, height: 80, borderRadius: 6 }} />
        <div style={{ flex: 1 }}>
            <IonSkeletonText animated style={{ width: '70%', height: 16, marginBottom: 8 }} />
            <IonSkeletonText animated style={{ width: '40%', height: 12, marginBottom: 6 }} />
            <IonSkeletonText animated style={{ width: '30%', height: 12 }} />
        </div>
    </div>
);

/** Skeleton cho trang Home mobile (slider + grid) */
export const MobileHomeSkeleton: React.FC = () => (
    <div style={{ padding: 16 }}>
        {/* Banner slider */}
        <IonSkeletonText animated style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 24 }} />
        {/* Section title */}
        <IonSkeletonText animated style={{ width: '30%', height: 18, marginBottom: 12 }} />
        {/* Horizontal scroll cards */}
        <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
            {Array.from({ length: 4 }, (_, i) => (
                <div key={i} style={{ minWidth: 120 }}>
                    <IonSkeletonText animated style={{ width: 120, height: 160, borderRadius: 8, marginBottom: 8 }} />
                    <IonSkeletonText animated style={{ width: '80%', height: 12, marginBottom: 4 }} />
                    <IonSkeletonText animated style={{ width: '50%', height: 10 }} />
                </div>
            ))}
        </div>
    </div>
);
