import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Server, Database, HardDrive, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

export const HealthCheckPage = () => {
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/health');
            setHealth(res.data);
        } catch (err: any) {
            toast.error(err.message || 'Lỗi khi kiểm tra health check');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        // Auto refresh every 30s
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'HEALTHY':
            case 'UP': return 'text-green-500 bg-green-50';
            case 'DEGRADED':
            case 'WARNING': return 'text-yellow-500 bg-yellow-50';
            case 'UNHEALTHY':
            case 'DOWN': return 'text-red-500 bg-red-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'HEALTHY':
            case 'UP': return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'DEGRADED':
            case 'WARNING': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            case 'UNHEALTHY':
            case 'DOWN': return <XCircle className="w-6 h-6 text-red-500" />;
            default: return <RefreshCw className="w-6 h-6 text-gray-500" />;
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">💚 System Health Check</h1>
                    <p className="text-gray-500 mt-1">Kiểm tra trạng thái hoạt động của các dịch vụ</p>
                </div>
                <div className="flex items-center space-x-4">
                    {health && (
                        <span className="text-sm text-gray-500">
                            Cập nhật: {new Date(health.timestamp).toLocaleTimeString()}
                        </span>
                    )}
                    <button onClick={fetchHealth} className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50 shadow-sm font-medium text-gray-700">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </button>
                </div>
            </div>

            {health ? (
                <>
                    {/* Overall Status */}
                    <div className={`p-6 rounded-xl border mb-8 flex items-center shadow-sm ${
                        health.overallStatus === 'HEALTHY' ? 'border-green-200 bg-green-50/50' :
                        health.overallStatus === 'DEGRADED' ? 'border-yellow-200 bg-yellow-50/50' : 'border-red-200 bg-red-50/50'
                    }`}>
                        {getStatusIcon(health.overallStatus)}
                        <div className="ml-4">
                            <h2 className={`text-lg font-bold uppercase ${getStatusColor(health.overallStatus).split(' ')[0]}`}>
                                HỆ THỐNG {health.overallStatus === 'HEALTHY' ? 'HOẠT ĐỘNG BÌNH THƯỜNG' : health.overallStatus}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Tất cả các service chính đang phản hồi ổn định.
                            </p>
                        </div>
                    </div>

                    {/* Service Grid */}
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng thái các Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {health.services.map((service: any, index: number) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        {service.name === 'PostgreSQL' ? <Database className="w-5 h-5 text-gray-400 mr-2" /> :
                                         service.name === 'FileStorage' ? <HardDrive className="w-5 h-5 text-gray-400 mr-2" /> :
                                         <Server className="w-5 h-5 text-gray-400 mr-2" />}
                                        <h4 className="font-semibold text-gray-800">{service.name}</h4>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(service.status)}`}>
                                        {service.status}
                                    </span>
                                </div>
                                
                                <div className="text-sm text-gray-600 space-y-2 mt-4">
                                    {service.responseTimeMs > 0 && (
                                        <div className="flex justify-between">
                                            <span>Response Time:</span>
                                            <span className="font-medium text-gray-900">{service.responseTimeMs}ms</span>
                                        </div>
                                    )}
                                    
                                    {service.errorMessage && (
                                        <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 rounded">
                                            {service.errorMessage}
                                        </div>
                                    )}

                                    {service.metadata && Object.entries(service.metadata).map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <span className="capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                            <span className="font-medium text-gray-900">{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    {loading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu'}
                </div>
            )}
        </div>
    );
};
