import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table, Card, Badge } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { HelpCircle, Plus, Edit2, Trash, Save, Eye } from 'lucide-react';
import * as api from '../api/helpArticleApi';

export const HelpArticles: React.FC = () => {
  const [articles, setArticles] = useState<api.HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<api.HelpArticle>>({
    title: '',
    slug: '',
    category: 'General',
    contentHtml: '',
    orderIndex: 0,
    isPublished: true
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await api.getArticles();
      setArticles(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách bài viết trợ giúp');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = async (article?: api.HelpArticle) => {
    if (article) {
      setIsEditing(true);
      try {
        // Fetch full article to get contentHtml
        const fullArticle = await api.getArticle(article.id);
        setFormData(fullArticle);
      } catch (error) {
        toast.error('Không thể tải nội dung bài viết');
        return;
      }
    } else {
      setIsEditing(false);
      setFormData({
        title: '', slug: '', category: 'General', contentHtml: '', orderIndex: 0, isPublished: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await api.updateArticle(formData.id, formData);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await api.createArticle(formData);
        toast.success('Tạo bài viết mới thành công');
      }
      handleCloseModal();
      fetchArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu bài viết');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết [${title}]?`)) return;
    try {
      await api.deleteArticle(id);
      toast.success('Xóa bài viết thành công');
      fetchArticles();
    } catch (error) {
      toast.error('Lỗi khi xóa bài viết');
    }
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <HelpCircle className="me-2 text-success" />
          Trung tâm Trợ giúp (Help Center CMS)
        </h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <Plus size={16} className="me-2" /> Thêm Bài viết
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3">Tiêu đề (Title)</th>
                <th className="border-0 py-3">Chuyên mục</th>
                <th className="border-0 py-3">Trạng thái</th>
                <th className="border-0 py-3">Lượt xem</th>
                <th className="border-0 py-3">Sắp xếp</th>
                <th className="border-0 px-4 py-3 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center p-4">Đang tải...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-4 text-muted">Chưa có bài viết trợ giúp nào.</td></tr>
              ) : (
                articles.map(article => (
                  <tr key={article.id}>
                    <td className="px-4">
                      <div className="fw-medium text-primary">{article.title}</div>
                      <div className="text-muted small">/{article.slug}</div>
                    </td>
                    <td><Badge bg="info">{article.category}</Badge></td>
                    <td>
                      {article.isPublished ? <Badge bg="success">Đang hiển thị</Badge> : <Badge bg="secondary">Ẩn</Badge>}
                    </td>
                    <td className="text-muted"><Eye size={14} className="me-1"/>{article.viewCount}</td>
                    <td>{article.orderIndex}</td>
                    <td className="px-4 text-end">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(article)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(article.id, article.title)}>
                        <Trash size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Sửa Bài viết' : 'Thêm Bài viết mới'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Tiêu đề bài viết <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" required 
                    value={formData.title} 
                    onChange={e => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setFormData({...formData, title, slug: isEditing ? formData.slug : slug});
                    }} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Đường dẫn (Slug) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" required 
                    value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.replace(/[^a-z0-9-]/g, '')})} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Chuyên mục (Category)</Form.Label>
                  <Form.Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="General">Chung (General)</option>
                    <option value="Account">Tài khoản (Account)</option>
                    <option value="Payment">Thanh toán (Payment)</option>
                    <option value="Reading">Đọc truyện (Reading)</option>
                    <option value="Author">Tác giả (Author)</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Thứ tự hiển thị (Order)</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: Number(e.target.value)})} 
                  />
                </Form.Group>
                <Form.Check 
                  type="switch"
                  id="isPublished-switch"
                  label="Hiển thị trên Help Center"
                  checked={formData.isPublished}
                  onChange={e => setFormData({...formData, isPublished: e.target.checked})}
                />
              </div>
              <div className="col-md-8 border-start">
                <Form.Group className="mb-3 h-100 d-flex flex-column">
                  <Form.Label>Nội dung (HTML) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    as="textarea" required className="flex-grow-1" style={{ minHeight: '400px' }}
                    value={formData.contentHtml} onChange={e => setFormData({...formData, contentHtml: e.target.value})} 
                    placeholder="<h1>Tiêu đề</h1><p>Nội dung bài viết...</p>"
                  />
                  <Form.Text className="text-muted mt-2">Hỗ trợ viết nội dung bằng thẻ HTML (Sau này có thể tích hợp thư viện Rich Text Editor như CKEditor hoặc Quill ở đây).</Form.Text>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit"><Save size={16} className="me-1" /> Lưu bài viết</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
