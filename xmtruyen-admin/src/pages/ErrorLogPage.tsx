import React, { useState, useEffect } from 'react';
import { 
    AlertTriangle, XCircle, AlertCircle, CheckCircle, Search, Filter, 
    RefreshCw, Trash2, X, Download
} from 'lucide-react';
import { apiClient as api } from '../api/userApi';
import toast from 'react-hot-toast';

export const ErrorLogPage = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterSeverity, setFilterSeverity] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [selectedError, setSelectedError] = useState<any | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/error-logs', {
                params: {
                    severity: filterSeverity,
                    category: filterCategory,
                    page: 1,
                    limit: 50
                }
            });
            if (res.data?.success) {
                setLogs(res.data.data);
            }
        } catch (err: any) {
            toast.error(err.message || 'Lỗi tải danh sách logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filterSeverity, filterCategory]);

    const getSeverityIcon = (sev: string) => {
        switch (sev) {
            case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🛡️ Error Log Dashboard</h1>
                    <p className="text-gray-500 mt-1">Quản lý hệ thống lỗi và cảnh báo tập trung</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={fetchLogs} className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Bộ lọc:</span>
                </div>
                
                <select 
                    value={filterSeverity} 
                    onChange={e => setFilterSeverity(e.target.value)}
                    className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">Tất cả Severity</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                <select 
                    value={filterCategory} 
                    onChange={e => setFilterCategory(e.target.value)}
                    className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">Tất cả Category</option>
                    <option value="REACT_CRASH">REACT_CRASH</option>
                    <option value="API_ERROR">API_ERROR</option>
                    <option value="SERVER_EXCEPTION">SERVER_EXCEPTION</option>
                    <option value="NETWORK">NETWORK</option>
                </select>
                
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm message..." 
                        className="w-full pl-10 border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr 
                                    key={log.id} 
                                    onClick={() => setSelectedError(log)}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getSeverityIcon(log.severity)}
                                            <span className="ml-2 text-sm font-medium text-gray-900 uppercase">
                                                {log.severity}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.category}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                                        {log.message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.endpoint || log.url}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Không tìm thấy log nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedError && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedError(null)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center">
                                        {getSeverityIcon(selectedError.severity)}
                                        <h3 className="text-lg leading-6 font-bold text-gray-900 ml-2" id="modal-title">
                                            {selectedError.severity.toUpperCase()} — {selectedError.category}
                                        </h3>
                                    </div>
                                    <button onClick={() => setSelectedError(null)} className="text-gray-400 hover:text-gray-500">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <div className="mt-2 text-sm text-gray-700">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div><strong>Thời gian:</strong> {new Date(selectedError.createdAt).toLocaleString('vi-VN')}</div>
                                        <div><strong>User ID:</strong> {selectedError.userId || 'Guest'}</div>
                                        <div><strong>URL / Endpoint:</strong> <br/> {selectedError.url || selectedError.endpoint}</div>
                                        <div><strong>Browser / IP:</strong> <br/> {selectedError.userAgent || selectedError.ipAddress}</div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-bold mb-2">Message:</h4>
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-md text-red-800 font-mono text-xs">
                                            {selectedError.message}
                                        </div>
                                    </div>

                                    {(selectedError.stackTrace || selectedError.componentStack) && (
                                        <div className="mb-4">
                                            <h4 className="font-bold mb-2">Stack Trace:</h4>
                                            <pre className="p-3 bg-gray-900 rounded-md text-green-400 font-mono text-xs overflow-x-auto">
                                                {selectedError.stackTrace}
                                                {selectedError.componentStack ? `\n\nComponent Stack:\n${selectedError.componentStack}` : ''}
                                            </pre>
                                        </div>
                                    )}

                                    {selectedError.requestBody && (
                                        <div className="mb-4">
                                            <h4 className="font-bold mb-2">Request Body:</h4>
                                            <pre className="p-3 bg-gray-100 rounded-md font-mono text-xs overflow-x-auto">
                                                {selectedError.requestBody}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setSelectedError(null)}>
                                    Đóng
                                </button>
                                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Copy Stack
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
