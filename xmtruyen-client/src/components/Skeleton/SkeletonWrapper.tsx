import React, { useEffect, useState } from 'react';

interface SkeletonWrapperProps {
    /** Äang loading hay khÃ´ng */
    isLoading: boolean;
    /** Skeleton hiá»ƒn thá»‹ khi loading */
    skeleton: React.ReactNode;
    /** Content tháº­t hiá»ƒn thá»‹ khi load xong */
    children: React.ReactNode;
    /** Thá»i gian transition (ms) */
    fadeDuration?: number;
    /** Delay tá»‘i thiá»ƒu hiá»ƒn thá»‹ skeleton (trÃ¡nh flash) */
    minDisplayTime?: number;
}

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
    isLoading,
    skeleton,
    children,
    fadeDuration = 200,
    minDisplayTime = 300
}) => {
    const [showSkeleton, setShowSkeleton] = useState(isLoading);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setShowSkeleton(true);
            setIsTransitioning(false);
        } else {
            // Äáº£m báº£o skeleton hiá»ƒn thá»‹ tá»‘i thiá»ƒu minDisplayTime ms
            const timer = setTimeout(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setShowSkeleton(false);
                    setIsTransitioning(false);
                }, fadeDuration);
            }, minDisplayTime);
            return () => clearTimeout(timer);
        }
    }, [isLoading, fadeDuration, minDisplayTime]);

    if (!showSkeleton) {
        return (
            <div className="skeleton-content-enter" style={{ animation: adeIn ms ease }}>
                {children}
            </div>
        );
    }

    return (
        <div className={skeleton-container }
             style={{ transition: opacity ms ease, opacity: isTransitioning ? 0 : 1 }}>
            {skeleton}
        </div>
    );
};
