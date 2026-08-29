export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ErrorCategory = 'REACT_CRASH' | 'API_ERROR' | 'NETWORK' | 'AUTH' | 'VALIDATION' | 'UNKNOWN';

export interface AppError {
    id?: string;
    type: ErrorCategory;
    severity: ErrorSeverity;
    message: string;
    stack?: string;
    componentStack?: string;
    url: string;
    endpoint?: string;
    statusCode?: number;
    requestBody?: string;
    responseBody?: string;
    timestamp: string;
    userAgent: string;
    userId?: string;
    metadata?: Record<string, any>;
}

class ErrorService {
    private queue: AppError[] = [];
    private maxQueueSize = 100;
    private flushInterval: number;
    private listeners: ((error: AppError) => void)[] = [];

    constructor() {
        // Flush queue mỗi 30 giây
        this.flushInterval = window.setInterval(() => this.flush(), 30000);

        // Bắt unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError({
                type: 'UNKNOWN',
                severity: 'high',
                message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
                stack: event.reason?.stack || '',
                url: window.location.href,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            });
        });

        // Bắt global JS errors
        window.addEventListener('error', (event) => {
            this.captureError({
                type: 'UNKNOWN',
                severity: 'high',
                message: event.message,
                stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            });
        });
    }

    public captureError(error: AppError) {
        // Assign ID
        error.id = `err_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

        // Thêm userId nếu đã login
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                error.userId = payload.sub || payload.nameid;
            } catch (e) { /* ignore */ }
        }

        // Auto-detect severity nếu chưa set
        if (!error.severity) {
            error.severity = this.detectSeverity(error);
        }

        // Thêm vào queue
        this.queue.push(error);
        if (this.queue.length > this.maxQueueSize) {
            this.queue.shift(); // Bỏ cũ nhất
        }

        // Lưu localStorage (offline backup)
        this.saveToLocalStorage(error);

        // Notify listeners (UI updates)
        this.listeners.forEach(fn => fn(error));

        // Nếu critical -> flush ngay
        if (error.severity === 'critical') {
            this.flush();
        }

        // Dev mode: vẫn console.error
        if (process.env.NODE_ENV === 'development') {
            console.error(`[ErrorService] [${error.severity}] ${error.type}:`, error.message);
        }
    }

    public captureApiError(axiosError: any, endpoint?: string) {
        const status = axiosError.response?.status;
        const category: ErrorCategory = 
            !axiosError.response ? 'NETWORK' :
            status === 401 || status === 403 ? 'AUTH' :
            status === 400 || status === 422 ? 'VALIDATION' :
            'API_ERROR';

        this.captureError({
            type: category,
            severity: status >= 500 ? 'high' : status === 401 ? 'medium' : 'low',
            message: axiosError.response?.data?.message || axiosError.message || 'API Error',
            endpoint: endpoint || axiosError.config?.url,
            statusCode: status,
            requestBody: JSON.stringify(axiosError.config?.data)?.substring(0, 500),
            responseBody: JSON.stringify(axiosError.response?.data)?.substring(0, 500),
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    }

    private async flush() {
        if (this.queue.length === 0) return;

        const errors = [...this.queue];
        this.queue = [];

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5242';
            await fetch(`${baseUrl}/api/admin/error-logs/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken') || ''}`
                },
                body: JSON.stringify({ errors }),
                keepalive: true
            });
        } catch (e) {
            // Nếu gửi thất bại -> đưa lại vào queue
            this.queue.unshift(...errors);
        }
    }

    private saveToLocalStorage(error: AppError) {
        try {
            const existing = JSON.parse(localStorage.getItem('xmtruyen_error_log') || '[]');
            existing.push(error);
            if (existing.length > 50) existing.splice(0, existing.length - 50);
            localStorage.setItem('xmtruyen_error_log', JSON.stringify(existing));
        } catch (e) { /* quota exceeded - ignore */ }
    }

    private detectSeverity(error: AppError): ErrorSeverity {
        if (error.type === 'REACT_CRASH') return 'critical';
        if (error.statusCode && error.statusCode >= 500) return 'high';
        if (error.type === 'NETWORK') return 'medium';
        return 'low';
    }

    public onError(listener: (error: AppError) => void) {
        this.listeners.push(listener);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    public getRecentErrors(): AppError[] {
        try {
            return JSON.parse(localStorage.getItem('xmtruyen_error_log') || '[]');
        } catch { return []; }
    }

    public clearLocalErrors() {
        localStorage.removeItem('xmtruyen_error_log');
    }

    public destroy() {
        clearInterval(this.flushInterval);
    }
}

export const errorService = new ErrorService();
