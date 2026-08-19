import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, ProgressBar, Badge, Table, Spinner, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlay, faUpload, faSave, faSync } from '@fortawesome/free-solid-svg-icons';
import { audioApi, type AudioJob } from '../api/audioApi';
import toast from 'react-hot-toast';

export const AudioJobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<AudioJob | null>(null);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProgress = async () => {
    if (!id) return;
    try {
      const res = await audioApi.getJobProgress(id);
      setJob(res.data);
      if (res.data.status === 'review' || res.data.status === 'generating') {
        const segRes = await audioApi.getJobSegments(id);
        setSegments(segRes.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải tiến độ job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
    // Poll every 5s if generating
    const interval = setInterval(() => {
      if (job && (job.status === 'generating' || job.status === 'preprocessing' || job.status === 'pending')) {
        fetchProgress();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [id, job?.status]);

  const handleStart = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await audioApi.startJob(id);
      toast.success('Đã bắt đầu Job!');
      fetchProgress();
    } catch (error: any) {
      toast.error(error.response?.data || 'Lỗi khi bắt đầu');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await audioApi.publishJob(id);
      toast.success('Đã xuất bản Audio Chapter thành công!');
      fetchProgress();
    } catch (error: any) {
      toast.error(error.response?.data || 'Lỗi khi xuất bản');
    } finally {
      setActionLoading(false);
    }
  };

  const updateSegmentText = async (segId: string, text: string) => {
    try {
      await audioApi.updateSegment(segId, { text });
      toast.success('Đã lưu thay đổi segment');
    } catch (error) {
      toast.error('Lỗi khi lưu segment');
    }
  };

  if (loading) return <div className="p-5 text-center"><Spinner animation="border" /></div>;
  if (!job) return <div className="p-5 text-center">Job not found</div>;

  const progressPercent = job.totalSegments > 0 
    ? Math.round((job.processedSegments / job.totalSegments) * 100) 
    : 0;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center mb-4">
        <Link to="/audio" className="btn btn-outline-secondary me-3">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h2 className="mb-0">🎧 Chi tiết Job: <small className="text-muted">{job.id.substring(0, 8)}</small></h2>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h5 className="mb-3">Tiến trình chuyển đổi (TTS)</h5>
              <div className="mb-2">
                <strong>Trạng thái: </strong>
                <Badge bg={job.status === 'review' ? 'warning' : job.status === 'published' ? 'success' : 'primary'}>
                  {job.status}
                </Badge>
              </div>
              <div>
                <strong>Segments đã xử lý: </strong> {job.processedSegments} / {job.totalSegments}
              </div>
            </div>
            <div>
              {job.status === 'pending' && (
                <Button variant="primary" onClick={handleStart} disabled={actionLoading}>
                  <FontAwesomeIcon icon={faPlay} className="me-2" /> Bắt đầu tạo Audio
                </Button>
              )}
              {job.status === 'review' && (
                <Button variant="success" onClick={handlePublish} disabled={actionLoading}>
                  <FontAwesomeIcon icon={faUpload} className="me-2" /> Xuất bản (Publish)
                </Button>
              )}
            </div>
          </div>

          <ProgressBar 
            now={progressPercent} 
            label={`${progressPercent}%`} 
            variant={job.status === 'failed' ? 'danger' : 'success'} 
            animated={job.status === 'generating'} 
          />
          {job.errorMessage && (
            <div className="alert alert-danger mt-3">{job.errorMessage}</div>
          )}
        </Card.Body>
      </Card>

      {segments.length > 0 && (
        <Card className="shadow-sm">
          <Card.Header className="bg-white py-3">
            <h5 className="mb-0">Dữ liệu Audio Segments</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>Thứ tự</th>
                  <th style={{ width: '120px' }}>Loại</th>
                  <th>Nội dung Text</th>
                  <th style={{ width: '150px' }}>Giọng đọc</th>
                  <th style={{ width: '100px' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {segments.map(seg => (
                  <tr key={seg.id}>
                    <td>{seg.orderIndex}</td>
                    <td>
                      <Badge bg={seg.segmentType === 'narration' ? 'secondary' : 'info'}>
                        {seg.segmentType}
                      </Badge>
                    </td>
                    <td>
                      <Form.Control 
                        as="textarea" 
                        rows={2}
                        defaultValue={seg.text}
                        onBlur={(e) => updateSegmentText(seg.id, e.target.value)}
                      />
                    </td>
                    <td>{seg.voiceProfileId}</td>
                    <td>
                      {seg.status === 'done' ? (
                        <Badge bg="success">Done</Badge>
                      ) : (
                        <Badge bg="warning">Pending</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
