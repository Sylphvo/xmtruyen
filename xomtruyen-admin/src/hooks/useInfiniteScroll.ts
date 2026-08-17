import { useState, useCallback, useRef, useEffect } from 'react';
import type { PaginatedResponse } from '../api/userApi';

// ============================================================
// useInfiniteScroll — Hook tái sử dụng cho toàn bộ bảng Admin
// ============================================================

interface UseInfiniteScrollOptions<T extends { id: string | number }, P = any> {
    /** Hàm fetch dữ liệu — trả về { data, totalCount, page, pageSize } */
    fetchFn: (params: P & { page: number; pageSize: number }) => Promise<PaginatedResponse<T>>;
    /** Số dòng mỗi lần load (default: 50) */
    pageSize?: number;
    /** Các params filter/search — khi thay đổi sẽ reset về trang 1 */
    params?: P;
    /** CÃ³ tá»± Ä‘á»™ng load láº§n Ä‘áº§u khÃ´ng (default: true) */
    autoLoad?: boolean;
}

interface UseInfiniteScrollReturn<T> {
    /** Máº£ng tÃ­ch lÅ©y toÃ n bá»™ items Ä‘Ã£ load */
    items: T[];
    /** Tá»•ng sá»‘ báº£n ghi tá»« backend */
    totalCount: number;
    /** Äang load láº§n Ä‘áº§u */
    isLoading: boolean;
    /** Äang load thÃªm (page 2, 3...) */
    isLoadingMore: boolean;
    /** CÃ²n dá»¯ liá»‡u Ä‘á»ƒ load thÃªm khÃ´ng */
    hasMore: boolean;
    /** Sá»‘ items Ä‘Ã£ load */
    loadedCount: number;
    /** Ref gáº¯n vÃ o sentinel element (div cuá»‘i báº£ng) */
    sentinelRef: React.RefObject<HTMLDivElement | null>;
    /** Reset vá»  trang 1 (khi filter/search thay Ä‘á»•i) */
    reset: () => void;
    /** Reload toÃ n bá»™ dá»¯ liá»‡u Ä‘Ã£ load (giá»¯ nguyÃªn vá»‹ trÃ­) */
    refresh: () => void;
    /** Cáº­p nháº­t 1 item trong máº£ng (inline edit) */
    updateItem: (id: string | number, updater: (item: T) => T) => void;
    /** XÃ³a 1 item khá» i máº£ng (optimistic delete) */
    removeItem: (id: string | number) => void;
    /** ThÃªm 1 item vÃ o Ä‘áº§u máº£ng (sau khi táº¡o má»›i) */
    prependItem: (item: T) => void;
}

export function useInfiniteScroll<T extends { id: string | number }, P = any>({
    fetchFn,
    pageSize = 50,
    params,
    autoLoad = true,
}: UseInfiniteScrollOptions<T, P>): UseInfiniteScrollReturn<T> {
    const [items, setItems] = useState<T[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // 0 = chÆ°a load gÃ¬
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isFetchingRef = useRef(false); // TrÃ¡nh race condition

    const hasMore = items.length < totalCount;

    // â”€â”€â”€ Fetch page tiáº¿p theo â”€â”€â”€
    const fetchNextPage = useCallback(async (isInitial = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        const nextPage = isInitial ? 1 : currentPage + 1;

        if (isInitial) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const res = await fetchFn({
                ...params as any,
                page: nextPage,
                pageSize
            });

            if (isInitial) {
                setItems(res.data);
            } else {
                setItems(prev => [...prev, ...res.data]);
            }
            setTotalCount(res.totalCount);
            setCurrentPage(nextPage);
        } catch (err) {
            console.error('[useInfiniteScroll] Fetch error:', err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            isFetchingRef.current = false;
        }
    }, [fetchFn, params, currentPage, pageSize]);

    // â”€â”€â”€ Load láº§n Ä‘áº§u â”€â”€â”€
    useEffect(() => {
        if (autoLoad) {
            fetchNextPage(true);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // â”€â”€â”€ Reset khi params thay Ä‘á»•i (search, filter) â”€â”€â”€
    const paramsRef = useRef(params);
    useEffect(() => {
        // So sÃ¡nh shallow
        if (JSON.stringify(paramsRef.current) !== JSON.stringify(params)) {
            paramsRef.current = params;
            setItems([]);
            setCurrentPage(0);
            setTotalCount(0);
            // Debounce Ä‘á»ƒ trÃ¡nh fetch liÃªn tá»¥c khi user Ä‘ang gÃµ
            const timer = setTimeout(() => {
                fetchNextPage(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

    // â”€â”€â”€ Intersection Observer â€” phÃ¡t hiá»‡n sentinel vÃ o viewport â”€â”€â”€
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !isFetchingRef.current) {
                    fetchNextPage(false);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '200px' // Báº¯t Ä‘áº§u fetch trÆ°á»›c khi user cuá»™n tá»›i sentinel 200px
            }
        );

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [hasMore, fetchNextPage]);

    // â”€â”€â”€ Public methods â”€â”€â”€
    const reset = useCallback(() => {
        setItems([]);
        setCurrentPage(0);
        setTotalCount(0);
        setTimeout(() => fetchNextPage(true), 0);
    }, [fetchNextPage]);

    const refresh = useCallback(async () => {
        // Reload táº¥t cáº£ pages Ä‘Ã£ load (giá»¯ scroll position)
        isFetchingRef.current = true;
        setIsLoading(true);
        try {
            const totalPages = currentPage;
            const allItems: T[] = [];
            for (let p = 1; p <= totalPages; p++) {
                const res = await fetchFn({ ...params as any, page: p, pageSize });
                allItems.push(...res.data);
                setTotalCount(res.totalCount);
            }
            setItems(allItems);
        } catch (err) {
            console.error('[useInfiniteScroll] Refresh error:', err);
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [fetchFn, params, currentPage, pageSize]);

    const updateItem = useCallback((id: string | number, updater: (item: T) => T) => {
        setItems(prev => prev.map(item => item.id === id ? updater(item) : item));
    }, []);

    const removeItem = useCallback((id: string | number) => {
        setItems(prev => prev.filter(item => item.id !== id));
        setTotalCount(prev => prev - 1);
    }, []);

    const prependItem = useCallback((item: T) => {
        setItems(prev => [item, ...prev]);
        setTotalCount(prev => prev + 1);
    }, []);

    return {
        items,
        totalCount,
        isLoading,
        isLoadingMore,
        hasMore,
        loadedCount: items.length,
        sentinelRef,
        reset,
        refresh,
        updateItem,
        removeItem,
        prependItem,
    };
}
