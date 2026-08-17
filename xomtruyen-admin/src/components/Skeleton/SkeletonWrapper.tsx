import React, { useEffect, useState } from 'react';

interface SkeletonWrapperProps {
    /** Đang loading hay không */
    isLoading: boolean;
    /** Skeleton hiển thị khi loading */
    skeleton: React.ReactNode;
    /** Content thật hiển thị khi load xong */
    children: React.ReactNode;
    /** Thời gian transition (ms) */
    fadeDuration?: number;
    /** Delay tối thiểu hiển thị skeleton (tránh flash) */
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
            // Đảm bảo skeleton hiển thị tối thiểu minDisplayTime ms
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
            <div className="skeleton-content-enter" style={{ animation: `fadeIn ${fadeDuration}ms ease` }}>
                {children}
            </div>
        );
    }

    return (
        <div className={`skeleton-container`}
             style={{ transition: `opacity ${fadeDuration}ms ease`, opacity: isTransitioning ? 0 : 1 }}>
            {skeleton}
        </div>
    );
};
