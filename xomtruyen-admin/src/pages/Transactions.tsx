import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Check, RefreshCw } from 'lucide-react';
import { getTransactions, getRevenueSummary, approveTransaction, type Transaction } from '../api/transactionApi';
import { ResizableHeader } from '../components/ResizableHeader';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [summary, setSummary] = useState({ totalRevenue: 0, todayRevenue: 0 });

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions({ status: statusFilter || undefined, page: 1, pageSize: 50 });
      setTransactions(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await getRevenueSummary();
      setSummary(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Xác nhận đã nhận tiền và duyệt giao dịch này?')) return;
    
    try {
      await approveTransaction(id);
      toast.success('Duyệt giao dịch thành công');
      fetchTransactions();
      fetchSummary();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi duyệt giao dịch');
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Giao dịch</h2>
        <div className="d-flex gap-3">
          <Card className="bg-primary text-white p-3 shadow-sm border-0 rounded-4">
            <div className="fs-6 opacity-75">Doanh thu hôm nay</div>
            <div className="fs-3 fw-bold">{summary.todayRevenue.toLocaleString()} VNĐ</div>
          </Card>
          <Card className="bg-success text-white p-3 shadow-sm border-0 rounded-4">
            <div className="fs-6 opacity-75">Tổng doanh thu</div>
            <div className="fs-3 fw-bold">{summary.totalRevenue.toLocaleString()} VNĐ</div>
          </Card>
        </div>
      </div>

      <div className="jira-table-container">
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
          <div className="d-flex gap-2">
            <Form.Select 
              size="sm"
              className="bg-transparent text-body border-secondary-subtle"
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              style={{ width: '200px', height: '32px', fontSize: '13px' }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Pending">Chờ duyệt (Pending)</option>
              <option value="Completed">Hoàn thành (Completed)</option>
              <option value="Failed">Thất bại (Failed)</option>
            </Form.Select>
            <Button variant="light" size="sm" onClick={fetchTransactions}><RefreshCw size={16} /></Button>
          </div>
        </div>

        {loading ? (
          <div className="p-5 text-center"><Spinner animation="border" /></div>
        ) : (
          <div className="table-responsive flex-grow-1 d-flex flex-column jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
            <table className="table align-middle mb-0" style={{ flexGrow: 1, borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
              <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  <ResizableHeader initialWidth={100} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Mã GD</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={200} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Người dùng</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Loại</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Số tiền / Xu</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Phương thức</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Trạng thái</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={180} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Thời gian</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Thao tác</span>
                  </ResizableHeader>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="jira-table-row" style={{ height: '46px' }}>
                    <td className="px-4 text-secondary" style={{ fontSize: '13px', padding: '12px 16px' }}>{t.id.substring(0, 8)}...</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div><strong>{t.userEmail ? t.userEmail.split('@')[0] : 'Unknown'}</strong></div>
                      <div className="text-secondary small">{t.userEmail}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge bg={t.transactionType === 'TopUp' ? 'info' : 'warning'}>
                        {t.transactionType === 'TopUp' ? 'Nạp Xu' : 'Mua VIP'}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="text-success fw-bold">{t.amount.toLocaleString()}đ</div>
                      {t.coinAmount && <div className="text-warning small">{t.coinAmount > 0 ? '+' : ''}{t.coinAmount} Xu</div>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{t.paymentMethod}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge bg={
                        t.status === 'Completed' ? 'success' : 
                        t.status === 'Pending' ? 'warning' : 'danger'
                      }>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="text-secondary small" style={{ padding: '12px 16px' }}>
                      {new Date(t.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {t.status === 'Pending' && t.paymentMethod === 'Manual' && (
                        <Button variant="success" size="sm" onClick={() => handleApprove(t.id)}>
                          <Check size={16} className="me-1"/> Duyệt
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>There are no work items here yet</h4>
                        <p>We couldn't find any data matching your criteria. Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
