import { useRef, useEffect, useState } from 'react';

/**
 * Hook cho scroll-triggered reveal animation.
 * Element sẽ animate vào khi xuất hiện trong viewport.
 */
export function useScrollReveal(options?: { threshold?: number; rootMargin?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (options?.delay) {
                        setTimeout(() => setIsVisible(true), options.delay);
                    } else {
                        setIsVisible(true);
                    }
                    observer.disconnect(); // Chỉ reveal 1 lần
                }
            },
            { threshold: options?.threshold || 0.1, rootMargin: options?.rootMargin || '0px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [options?.threshold, options?.rootMargin, options?.delay]);

    const style: React.CSSProperties = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 500ms ease, transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return { ref, isVisible, style };
}
