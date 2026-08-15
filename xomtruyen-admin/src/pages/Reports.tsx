import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table, Badge, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, MessageSquare, BookOpen, User } from 'lucide-react';
import * as api from '../api/reportApi';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<api.Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<api.Report | null>(null);
  const [resolutionData, setResolutionData] = useState({
    status: 'Resolved',
    resolutionNote: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách Báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = async (report: api.Report) => {
    try {
      // Fetch full details (although we might already have most of it)
      const fullReport = await api.getReportDetail(report.id);
      setSelectedReport(fullReport);
      setResolutionData({
        status: fullReport.status === 'Pending' ? 'Resolved' : fullReport.status,
        resolutionNote: fullReport.resolutionNote || ''
      });
      setShowModal(true);
    } catch (error) {
      toast.error('Không thể tải chi tiết báo cáo');
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      await api.resolveReport(selectedReport.id, resolutionData);
      toast.success('Đã xử lý báo cáo');
      handleCloseModal();
      fetchReports();
    } catch (error) {
      toast.error('Lỗi khi xử lý báo cáo');
    }
  };

  const getTargetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'publication':
      case 'chapter':
        return <BookOpen size={16} className="me-1" />;
      case 'user':
        return <User size={16} className="me-1" />;
      case 'review':
      case 'comment':
        return <MessageSquare size={16} className="me-1" />;
      default:
        return <AlertTriangle size={16} className="me-1" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <Badge bg="success">Đã xử lý</Badge>;
      case 'Dismissed':
        return <Badge bg="secondary">Bỏ qua</Badge>;
      default:
        return <Badge bg="warning" text="dark">Chờ xử lý</Badge>;
    }
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <ShieldAlert className="me-2 text-danger" />
          Hệ thống Báo cáo (Reports)
        </h4>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3">Ngày gửi</th>
                <th className="border-0 py-3">Người báo cáo</th>
                <th className="border-0 py-3">Đối tượng</th>
                <th className="border-0 py-3">Lý do</th>
                <th className="border-0 py-3">Trạng thái</th>
                <th className="border-0 px-4 py-3 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">Đang tải...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-muted">Chưa có báo cáo nào.</td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report.id} style={{ opacity: report.status !== 'Pending' ? 0.7 : 1 }}>
                    <td className="px-4">
                      {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className="fw-medium">{report.reporterName}</span>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="border d-inline-flex align-items-center">
                        {getTargetIcon(report.targetType)} {report.targetType}
                      </Badge>
                      <div className="small text-muted text-truncate mt-1" style={{ maxWidth: '200px' }} title={report.targetId}>
                        ID: {report.targetId}
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium text-danger">{report.reason}</div>
                      <div className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
                        {report.description}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-4 text-end">
                      <Button 
                        variant={report.status === 'Pending' ? 'primary' : 'light'} 
                        size="sm"
                        onClick={() => handleShowModal(report)}
                      >
                        {report.status === 'Pending' ? 'Xử lý' : 'Xem'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết Báo cáo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div className="row">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h6 className="fw-bold mb-3 text-primary">Thông tin báo cáo</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2"><strong>Người gửi:</strong> {selectedReport.reporterName}</li>
                    <li className="mb-2"><strong>Ngày gửi:</strong> {new Date(selectedReport.createdAt).toLocaleString('vi-VN')}</li>
                    <li className="mb-2">
                      <strong>Đối tượng bị báo cáo:</strong>{' '}
                      <Badge bg="light" text="dark" className="border ms-1">{selectedReport.targetType}</Badge>
                      <div className="small text-muted mt-1 user-select-all bg-light p-1 rounded">{selectedReport.targetId}</div>
                    </li>
                    <li className="mb-2 mt-3">
                      <strong>Lý do vi phạm:</strong> <Badge bg="danger">{selectedReport.reason}</Badge>
                    </li>
                    <li>
                      <strong>Chi tiết mô tả:</strong>
                      <div className="bg-light p-2 rounded mt-1 small" style={{ minHeight: '60px' }}>
                        {selectedReport.description || <i>Không có mô tả thêm.</i>}
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="col-md-6 border-start">
                  <h6 className="fw-bold mb-3 text-primary">Xử lý báo cáo</h6>
                  
                  {selectedReport.status !== 'Pending' && (
                    <div className="alert alert-info py-2 small mb-3">
                      Báo cáo này đã được {selectedReport.resolvedBy || 'Admin'} xử lý vào lúc {selectedReport.resolvedAt ? new Date(selectedReport.resolvedAt).toLocaleString('vi-VN') : ''}.
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select 
                      value={resolutionData.status}
                      onChange={e => setResolutionData({...resolutionData, status: e.target.value})}
                      disabled={selectedReport.status !== 'Pending'}
                    >
                      <option value="Resolved">Chấp nhận (Đã xử lý vi phạm)</option>
                      <option value="Dismissed">Từ chối (Báo cáo sai/Không vi phạm)</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ghi chú xử lý (Nội bộ)</Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={4}
                      value={resolutionData.resolutionNote}
                      onChange={e => setResolutionData({...resolutionData, resolutionNote: e.target.value})}
                      disabled={selectedReport.status !== 'Pending'}
                      placeholder="Ghi lại hành động đã thực hiện (VD: Đã khóa mõm user, Đã xóa bình luận...)"
                    />
                  </Form.Group>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
            {selectedReport?.status === 'Pending' && (
              <Button variant="primary" type="submit">
                <CheckCircle size={18} className="me-1" /> Xác nhận xử lý
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
