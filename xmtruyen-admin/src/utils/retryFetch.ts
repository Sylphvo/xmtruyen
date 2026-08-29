import { errorService } from '../services/errorService';

interface RetryOptions {
    maxRetries?: number;
    retryDelay?: number;
    retryOn?: number[];
    onRetry?: (attempt: number, error: any) => void;
}

export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const { maxRetries = 3, retryDelay = 1000, retryOn = [408, 500, 502, 503, 504], onRetry } = options;

    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            const status = error.response?.status;

            // Không retry nếu là lỗi client (4xx) trừ 408 timeout
            if (status && status >= 400 && status < 500 && !retryOn.includes(status)) {
                throw error;
            }

            // Đã hết lượt retry
            if (attempt > maxRetries) {
                errorService.captureApiError(error);
                throw error;
            }

            // Callback thông báo đang retry
            onRetry?.(attempt, error);

            // Exponential backoff: 1s, 2s, 4s...
            const delay = retryDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}
