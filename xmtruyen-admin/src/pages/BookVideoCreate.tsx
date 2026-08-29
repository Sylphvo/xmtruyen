import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/userApi';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { bookVideoApi } from '../api/bookVideoApi';
import toast from 'react-hot-toast';

export const BookVideoCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [publications, setPublications] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    publicationId: '',
    chapterIds: [] as string[],
    imageSource: 'stable-diffusion',
    artStyle: 'chinese_fantasy',
    segmentWordCount: 150,
    language: 'vi-VN',
    voiceId: 'vi-VN-NamMinhNeural',
    resolution: '1080p',
    transition: 'kenburns',
    addSubtitles: true,
    addIntroOutro: true,
    backgroundMusic: {
      enabled: true,
      genre: 'epic_orchestral',
      volume: 0.2
    }
  });

  useEffect(() => {
    // Fetch mock publications or real publications
    const fetchPubs = async () => {
      try {
        const res = await apiClient.get('/admin/publications?page=1&limit=50');
        setPublications(res.data.items || []);
      } catch {
        // Fallback or ignore
      }
    };
    fetchPubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.publicationId) {
      toast.error('Vui lòng chọn truyện');
      return;
    }

    // Mock chapter selection (In a real app, we fetch chapters of the selected publication)
    const payload = {
      ...formData,
      chapterIds: [formData.publicationId] // Dummy chapter ID using pub ID for testing
    };

    setLoading(true);
    try {
      await bookVideoApi.createTask(payload);
      toast.success('Đã tạo task thành công');
      navigate('/book-video');
    } catch (error: any) {
      toast.error(error.response?.data?.Message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">🎬 Tạo Video Storytelling Mới</h2>
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-light fw-bold">1. Chọn Nội Dung</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Sách / Truyện</Form.Label>
                  <Form.Select 
                    value={formData.publicationId}
                    onChange={(e) => setFormData({...formData, publicationId: e.target.value})}
                    required
                  >
                    <option value="">-- Chọn truyện --</option>
                    {publications.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                    {/* Mock Option if DB is empty */}
                    <option value="00000000-0000-0000-0000-000000000001">Đấu Phá Thương Khung (Test)</option>
                  </Form.Select>
                </Form.Group>
                <Alert variant="info" className="mb-0">
                  <small>Tính năng chọn từng chương đang được hoàn thiện. Tạm thời hệ thống sẽ tự động chọn chương 1 của truyện.</small>
                </Alert>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-light fw-bold">2. Hình Ảnh Minh Họa</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nguồn ảnh (AI Provider)</Form.Label>
                      <Form.Select 
                        value={formData.imageSource}
                        onChange={(e) => setFormData({...formData, imageSource: e.target.value})}
                      >
                        <option value="stable-diffusion">Stable Diffusion (Local)</option>
                        <option value="dall-e">DALL-E 3 (OpenAI)</option>
                        <option value="stock">Stock Images / Mock (Dev)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phong cách Art (Art Style)</Form.Label>
                      <Form.Select 
                        value={formData.artStyle}
                        onChange={(e) => setFormData({...formData, artStyle: e.target.value})}
                      >
                        <option value="Tiên Hiệp">Tiên Hiệp / Fantasy</option>
                        <option value="Ngôn Tình">Ngôn Tình / Romance</option>
                        <option value="Sci-Fi">Sci-Fi / Cyberpunk</option>
                        <option value="Manga">Manga / Anime</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-light fw-bold">3. Cấu Hình Audio & Video</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Giọng đọc (TTS)</Form.Label>
                  <Form.Select 
                    value={formData.voiceId}
                    onChange={(e) => setFormData({...formData, voiceId: e.target.value})}
                  >
                    <option value="vi-VN-NamMinhNeural">NamMinh (Nam, Trầm ấm)</option>
                    <option value="vi-VN-HoaiMyNeural">HoàiMy (Nữ, Truyền cảm)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hiệu ứng Video</Form.Label>
                  <Form.Select 
                    value={formData.transition}
                    onChange={(e) => setFormData({...formData, transition: e.target.value})}
                  >
                    <option value="kenburns">Ken Burns (Zoom & Pan)</option>
                    <option value="fade">Fade in/out</option>
                    <option value="none">Tĩnh (Static)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Check 
                  type="switch"
                  label="Tạo và hiển thị phụ đề (Subtitles)"
                  checked={formData.addSubtitles}
                  onChange={(e) => setFormData({...formData, addSubtitles: e.target.checked})}
                  className="mb-3"
                />

                <Form.Check 
                  type="switch"
                  label="Ghép nhạc nền (BGM)"
                  checked={formData.backgroundMusic.enabled}
                  onChange={(e) => setFormData({
                    ...formData, 
                    backgroundMusic: { ...formData.backgroundMusic, enabled: e.target.checked }
                  })}
                  className="mb-3"
                />

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? <Spinner size="sm" className="me-2" /> : null}
                  Khởi Tạo Video
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
