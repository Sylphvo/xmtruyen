import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { BarChart2, Clock, Users, BookOpen, Smartphone, Globe } from 'lucide-react';
import * as api from '../api/readingAnalyticApi';

export const ReadingAnalytics: React.FC = () => {
  const [data, setData] = useState<api.AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.getReadingAnalytics(days);
      setData(result);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu phân tích lượt đọc');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <BarChart2 className="me-2 text-primary" />
          Phân tích Lượt đọc (Reading Analytics)
        </h4>
        <div className="d-flex align-items-center">
          <span className="me-2 text-muted small">Thời gian:</span>
          <Form.Select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ width: '150px' }}
          >
            <option value={1}>Hôm nay</option>
            <option value={7}>7 ngày qua</option>
            <option value={30}>30 ngày qua</option>
            <option value={90}>3 tháng qua</option>
          </Form.Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">Đang xử lý dữ liệu...</div>
      ) : data ? (
        <>
          {/* Tổng quan ngắn gọn bằng ChartData (Chỉ hiển thị tổng số) */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <Card className="shadow-sm border-0 bg-primary text-white h-100">
                <Card.Body>
                  <h6 className="opacity-75 mb-3">Tổng số lượt đọc</h6>
                  <h3 className="mb-0 fw-bold">
                    {data.chartData.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
                  </h3>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="shadow-sm border-0 bg-success text-white h-100">
                <Card.Body>
                  <h6 className="opacity-75 mb-3">Tổng thời gian đọc</h6>
                  <h3 className="mb-0 fw-bold">
                    {formatDuration(data.chartData.reduce((acc, curr) => acc + curr.totalDuration, 0))}
                  </h3>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="shadow-sm border-0 bg-info text-white h-100">
                <Card.Body>
                  <h6 className="opacity-75 mb-3">Thời gian đọc trung bình / lượt</h6>
                  <h3 className="mb-0 fw-bold">
                    {(() => {
                      const totalCount = data.chartData.reduce((acc, curr) => acc + curr.count, 0);
                      const totalDur = data.chartData.reduce((acc, curr) => acc + curr.totalDuration, 0);
                      return totalCount > 0 ? formatDuration(totalDur / totalCount) : '0s';
                    })()}
                  </h3>
                </Card.Body>
              </Card>
            </div>
          </div>

          <div className="row g-4">
            {/* Top truyện */}
            <div className="col-lg-5">
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-0 pt-4 pb-0">
                  <h6 className="fw-bold mb-0">Top Truyện được đọc nhiều nhất</h6>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table borderless size="sm" className="align-middle mb-0">
                      <thead>
                        <tr className="text-muted small border-bottom">
                          <th>Tên truyện</th>
                          <th className="text-end">Lượt đọc</th>
                          <th className="text-end">TB. Thời gian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topPublications.map((pub, idx) => (
                          <tr key={pub.publicationId}>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="text-muted me-2" style={{ width: '20px' }}>#{idx + 1}</span>
                                <span className="text-truncate fw-medium" style={{ maxWidth: '180px' }} title={pub.title}>
                                  {pub.title}
                                </span>
                              </div>
                            </td>
                            <td className="text-end fw-bold text-primary">{pub.readCount.toLocaleString()}</td>
                            <td className="text-end text-muted small">{formatDuration(pub.avgDuration)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Logs gần đây */}
            <div className="col-lg-7">
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0">Hoạt động đọc gần đây (Live)</h6>
                  <Badge bg="light" text="dark" className="border">Top 100</Badge>
                </Card.Header>
                <Card.Body className="p-0 mt-3">
                  <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table hover className="align-middle mb-0" style={{ fontSize: '14px' }}>
                      <thead className="bg-light sticky-top">
                        <tr>
                          <th className="border-0 ps-4">Thời gian</th>
                          <th className="border-0">Người đọc</th>
                          <th className="border-0">Truyện</th>
                          <th className="border-0">Thời lượng</th>
                          <th className="border-0 pe-4">Thiết bị</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentLogs.map(log => (
                          <tr key={log.id}>
                            <td className="ps-4 text-muted small">
                              {new Date(log.readAt).toLocaleString('vi-VN')}
                            </td>
                            <td>
                              {log.isGuest ? (
                                <Badge bg="secondary" className="fw-normal">Khách</Badge>
                              ) : (
                                <span className="fw-medium text-primary"><Users size={12} className="me-1"/>{log.userName}</span>
                              )}
                            </td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: '200px' }} title={log.publicationTitle}>
                                <BookOpen size={12} className="me-1 text-muted" />
                                {log.publicationTitle}
                              </div>
                            </td>
                            <td>
                              <span className="text-success fw-medium"><Clock size={12} className="me-1"/>{formatDuration(log.readingDurationSeconds)}</span>
                            </td>
                            <td className="pe-4 text-muted small text-truncate" style={{ maxWidth: '120px' }} title={log.deviceInfo}>
                              {log.deviceInfo?.toLowerCase().includes('mobile') ? <Smartphone size={12} className="me-1"/> : <Globe size={12} className="me-1"/>}
                              {log.deviceInfo || 'Unknown'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
