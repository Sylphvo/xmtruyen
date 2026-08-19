import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Spinner, Modal, Form, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { audioApi, type CharacterVoiceMapping, type VoiceProfile } from '../api/audioApi';
import toast from 'react-hot-toast';

export const AudioCharacters: React.FC = () => {
  const { publicationId } = useParams<{ publicationId: string }>();
  const [mappings, setMappings] = useState<CharacterVoiceMapping[]>([]);
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CharacterVoiceMapping>>({
    characterName: '', voiceProfileId: '', notes: ''
  });

  const fetchData = async () => {
    if (!publicationId) return;
    try {
      const [mapRes, voiceRes] = await Promise.all([
        audioApi.getCharacterMappings(publicationId),
        audioApi.getVoices()
      ]);
      setMappings(mapRes.data);
      setVoices(voiceRes.data);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [publicationId]);

  const handleShowModal = (mapping?: CharacterVoiceMapping) => {
    if (mapping) {
      setFormData(mapping);
      setIsEditing(true);
    } else {
      setFormData({ characterName: '', voiceProfileId: '', notes: '' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicationId) return;
    
    try {
      if (isEditing) {
        await audioApi.updateCharacterMapping(formData.id!, formData);
        toast.success('Đã cập nhật mapping');
      } else {
        await audioApi.createCharacterMapping({ ...formData, publicationId });
        toast.success('Đã thêm mapping mới');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error('Lỗi khi lưu dữ liệu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa mapping này?')) return;
    try {
      await audioApi.deleteCharacterMapping(id);
      toast.success('Đã xóa mapping');
      fetchData();
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center mb-4">
        <Link to="/audio" className="btn btn-outline-secondary me-3">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h2 className="mb-0">👥 Quản lý Nhân Vật - Giọng Nói</h2>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Publication ID: </strong> <code>{publicationId}</code>
          </div>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Thêm Nhân Vật
          </Button>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-5"><Spinner animation="border" /></div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Tên Nhân Vật</th>
                  <th>Giọng (Voice Profile)</th>
                  <th>Ghi chú</th>
                  <th style={{ width: '120px' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {mappings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-muted">Chưa có nhân vật nào được map.</td>
                  </tr>
                ) : (
                  mappings.map(map => {
                    const voice = voices.find(v => v.id === map.voiceProfileId);
                    return (
                      <tr key={map.id}>
                        <td><strong>{map.characterName}</strong></td>
                        <td>
                          {voice ? `${voice.displayName} (${voice.id})` : map.voiceProfileId}
                        </td>
                        <td>{map.notes}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(map)}>
                            <FontAwesomeIcon icon={faPen} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(map.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Sửa Mapping' : 'Thêm Nhân Vật'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên Nhân Vật</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.characterName} 
                onChange={e => setFormData({...formData, characterName: e.target.value})} 
                placeholder="VD: Lâm Phong"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Voice Profile (Giọng đọc)</Form.Label>
              <Form.Select 
                value={formData.voiceProfileId} 
                onChange={e => setFormData({...formData, voiceProfileId: e.target.value})}
                required
              >
                <option value="">-- Chọn Giọng --</option>
                {voices.filter(v => v.voiceType === 'character').map(v => (
                  <option key={v.id} value={v.id}>{v.displayName} ({v.id})</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                value={formData.notes || ''} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
                placeholder="VD: Giọng lạnh lùng..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="primary" type="submit">Lưu</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
