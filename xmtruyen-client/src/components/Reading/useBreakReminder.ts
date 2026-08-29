import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

export const useBreakReminder = (enabled: boolean, intervalMinutes: number) => {
    const [lastBreak, setLastBreak] = useState<number>(Date.now());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        const checkTime = () => {
            const now = Date.now();
            const elapsedMinutes = (now - lastBreak) / (1000 * 60);

            if (elapsedMinutes >= intervalMinutes) {
                // Soft reminder: Using toast instead of blocking modal to preserve position
                toast('Mắt bạn cần nghỉ ngơi! Đã đọc liên tục ' + intervalMinutes + ' phút.', {
                    icon: '👀',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 6000,
                });
                
                // Reset timer after reminder
                setLastBreak(now);
            }
        };

        // Check every minute
        intervalRef.current = setInterval(checkTime, 60000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [enabled, intervalMinutes, lastBreak]);

    // Function to manually reset the timer (e.g. if user took a break intentionally)
    const resetTimer = () => setLastBreak(Date.now());

    return { resetTimer };
};
