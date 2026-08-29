import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Card, Badge } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Edit2, Trash, Plus, Users, Globe, Twitter, BookOpen } from 'lucide-react';
import * as api from '../api/authorApi';

export const Authors: React.FC = () => {
  const [authors, setAuthors] = useState<api.Author[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatarUrl: '',
    website: '',
    twitter: ''
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const data = await api.getAuthors();
      setAuthors(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách Tác giả');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (author?: api.Author) => {
    if (author) {
      setEditingId(author.id);
      setFormData({
        name: author.name,
        description: author.description || '',
        avatarUrl: author.avatarUrl || '',
        website: author.website || '',
        twitter: author.twitter || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        avatarUrl: '',
        website: '',
        twitter: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateAuthor(editingId, formData);
        toast.success('Cập nhật Tác giả thành công');
      } else {
        await api.createAuthor(formData);
        toast.success('Thêm Tác giả thành công');
      }
      handleCloseModal();
      fetchAuthors();
    } catch (error) {
      toast.error('Lỗi khi lưu Tác giả');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Tác giả này?')) return;
    try {
      await api.deleteAuthor(id);
      toast.success('Xóa Tác giả thành công');
      fetchAuthors();
    } catch (error) {
      toast.error('Lỗi khi xóa. Có thể tác giả đang có truyện.');
    }
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <Users className="me-2 text-primary" />
          Quản lý Tác giả
        </h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <Plus size={16} className="me-2" />
          Thêm Tác giả
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-4">Đang tải...</div>
      ) : (
        <div className="row g-4">
          {authors.map(author => (
            <div key={author.id} className="col-md-6 col-lg-4">
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-start mb-3">
                    <div 
                      className="rounded-circle overflow-hidden bg-light border me-3 flex-shrink-0"
                      style={{ width: '64px', height: '64px' }}
                    >
                      {author.avatarUrl ? (
                        <img src={author.avatarUrl} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                          <Users size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <h5 className="mb-1 text-truncate" title={author.name}>{author.name}</h5>
                      <div className="text-muted small">
                        <BookOpen size={14} className="me-1" />
                        {author.publicationCount} tác phẩm
                      </div>
                    </div>
                  </div>

                  <Card.Text className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {author.description || 'Chưa có tiểu sử.'}
                  </Card.Text>
                  
                  <div className="d-flex gap-2 mb-3">
                    {author.website && (
                      <a href={author.website} target="_blank" rel="noreferrer" className="text-secondary" title="Website">
                        <Globe size={18} />
                      </a>
                    )}
                    {author.twitter && (
                      <a href={author.twitter} target="_blank" rel="noreferrer" className="text-info" title="Twitter">
                        <Twitter size={18} />
                      </a>
                    )}
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => handleShowModal(author)}>
                      <Edit2 size={16} className="me-1" /> Sửa
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(author.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
          {authors.length === 0 && (
            <div className="col-12 text-center p-5 text-muted">
              Chưa có tác giả nào.
            </div>
          )}
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Sửa Tác giả' : 'Thêm Tác giả'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên tác giả (Bút danh) <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="VD: Fujiko F. Fujio"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tiểu sử / Giới thiệu</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Avatar URL (Link ảnh)</Form.Label>
              <Form.Control 
                type="url" 
                value={formData.avatarUrl} 
                onChange={e => setFormData({...formData, avatarUrl: e.target.value})} 
                placeholder="https://..."
              />
            </Form.Group>
            <div className="row mb-3">
              <Form.Group className="col-6">
                <Form.Label>Website (Tùy chọn)</Form.Label>
                <Form.Control 
                  type="url" 
                  value={formData.website} 
                  onChange={e => setFormData({...formData, website: e.target.value})} 
                />
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Twitter (Tùy chọn)</Form.Label>
                <Form.Control 
                  type="url" 
                  value={formData.twitter} 
                  onChange={e => setFormData({...formData, twitter: e.target.value})} 
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit">Lưu thay đổi</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
