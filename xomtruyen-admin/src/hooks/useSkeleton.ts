import { useState, useEffect, useRef } from 'react';

interface UseSkeletonOptions {
    /** Äang loading */
    isLoading: boolean;
    /** Thá»i gian tá»‘i thiá»ƒu hiá»ƒn thá»‹ skeleton (ms) â€” trÃ¡nh flash */
    minDisplayTime?: number;
    /** Delay trÆ°á»›c khi hiá»‡n skeleton (ms) â€” náº¿u load < delay thÃ¬ khÃ´ng hiá»‡n skeleton */
    delay?: number;
}

/**
 * Hook quáº£n lÃ½ tráº¡ng thÃ¡i hiá»ƒn thá»‹ skeleton.
 * - TrÃ¡nh flash skeleton (hiá»‡n rá»“i biáº¿n máº¥t ngay náº¿u load nhanh)
 * - Äáº£m báº£o skeleton hiá»ƒn thá»‹ tá»‘i thiá»ƒu N ms (trÃ¡nh giáº­t)
 */
export function useSkeleton({ isLoading, minDisplayTime = 400, delay = 100 }: UseSkeletonOptions) {
    const [showSkeleton, setShowSkeleton] = useState(false);
    const loadStartRef = useRef<number>(0);
    const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isLoading) {
            loadStartRef.current = Date.now();

            // Chá»‰ hiá»‡n skeleton náº¿u loading kÃ©o dÃ i hÆ¡n delay ms
            delayTimerRef.current = setTimeout(() => {
                setShowSkeleton(true);
            }, delay);
        } else {
            // Clear delay timer náº¿u load xong trÆ°á»›c khi skeleton hiá»‡n
            if (delayTimerRef.current) {
                clearTimeout(delayTimerRef.current);
            }

            if (showSkeleton) {
                // Äáº£m báº£o skeleton hiá»ƒn thá»‹ tá»‘i thiá»ƒu minDisplayTime
                const elapsed = Date.now() - loadStartRef.current;
                const remaining = Math.max(0, minDisplayTime - elapsed);

                setTimeout(() => {
                    setShowSkeleton(false);
                }, remaining);
            }
        }

        return () => {
            if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
        };
    }, [isLoading]);

    return { showSkeleton };
}
