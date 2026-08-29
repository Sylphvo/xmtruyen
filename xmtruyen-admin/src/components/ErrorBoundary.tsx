import React from 'react';
import { errorService } from '../services/errorService';

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
    state: State = { hasError: false, error: null, errorInfo: null };

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Ghi log vào hệ thống Error Management
        errorService.captureError({
            type: 'REACT_CRASH',
            severity: 'critical',
            message: error.message,
            stack: error.stack || '',
            componentStack: errorInfo.componentStack || '',
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });

        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '100vh', padding: '40px',
                    backgroundColor: '#f8fafc', textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💥</div>
                    <h2 style={{ color: '#1f2937', marginBottom: '8px' }}>Ứng dụng gặp sự cố</h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '400px' }}>
                        Đã xảy ra lỗi không mong muốn. Lỗi đã được ghi nhận và đội ngũ kỹ thuật sẽ khắc phục sớm nhất.
                    </p>

                    {/* Error details (dev mode) */}
                    {import.meta.env.DEV && this.state.error && (
                        <details style={{ marginBottom: '20px', textAlign: 'left', maxWidth: '600px' }}>
                            <summary style={{ cursor: 'pointer', color: '#ef4444' }}>Chi tiết lỗi (Dev)</summary>
                            <pre style={{ fontSize: '12px', overflow: 'auto', padding: '12px', background: '#1f2937', color: '#f87171', borderRadius: '8px', marginTop: '8px' }}>
                                {this.state.error.message}{"\n\n"}{this.state.error.stack}
                            </pre>
                        </details>
                    )}

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={this.handleReset} style={{
                            padding: '10px 24px', backgroundColor: '#2196f3', color: '#fff',
                            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                        }}>
                            Thử lại
                        </button>
                        <button onClick={() => window.location.href = '/'} style={{
                            padding: '10px 24px', backgroundColor: '#e5e7eb', color: '#374151',
                            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                        }}>
                            Về trang chủ
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
