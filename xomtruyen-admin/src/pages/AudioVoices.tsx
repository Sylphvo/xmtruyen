import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { audioApi, type VoiceProfile } from '../api/audioApi';
import toast from 'react-hot-toast';

export const AudioVoices: React.FC = () => {
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<VoiceProfile>>({
    id: '', displayName: '', voiceType: 'narrator', gender: 'male', ttsProvider: 'edge_tts', ttsVoiceId: '', isActive: true
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchVoices = async () => {
    try {
      const res = await audioApi.getVoices();
      setVoices(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách giọng đọc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoices();
  }, []);

  const handleShowModal = (voice?: VoiceProfile) => {
    if (voice) {
      setFormData(voice);
      setIsEditing(true);
    } else {
      setFormData({
        id: '', displayName: '', voiceType: 'narrator', gender: 'male', ttsProvider: 'edge_tts', ttsVoiceId: '', isActive: true
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await audioApi.updateVoice(formData.id!, formData);
        toast.success('Đã cập nhật giọng đọc');
      } else {
        await audioApi.createVoice(formData);
        toast.success('Đã tạo giọng đọc mới');
      }
      setShowModal(false);
      fetchVoices();
    } catch (error) {
      toast.error('Lỗi khi lưu giọng đọc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa giọng đọc này?')) return;
    try {
      await audioApi.deleteVoice(id);
      toast.success('Đã xóa giọng đọc');
      fetchVoices();
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎤 Quản lý Giọng Đọc (Voice Profiles)</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Thêm Giọng Đọc
        </Button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-5"><Spinner animation="border" /></div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Tên hiển thị</th>
                  <th>Loại</th>
                  <th>Giới tính</th>
                  <th>Provider</th>
                  <th>Voice ID (API)</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {voices.map(voice => (
                  <tr key={voice.id}>
                    <td><strong>{voice.id}</strong></td>
                    <td>{voice.displayName}</td>
                    <td><Badge bg={voice.voiceType === 'narrator' ? 'info' : 'secondary'}>{voice.voiceType}</Badge></td>
                    <td>{voice.gender === 'male' ? 'Nam' : 'Nữ'}</td>
                    <td><Badge bg="dark">{voice.ttsProvider}</Badge></td>
                    <td><code>{voice.ttsVoiceId}</code></td>
                    <td>
                      {voice.isActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Inactive</Badge>}
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(voice)}>
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(voice.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Sửa Giọng Đọc' : 'Thêm Giọng Đọc'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Voice ID (Unique)</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.id} 
                onChange={e => setFormData({...formData, id: e.target.value})} 
                disabled={isEditing}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên hiển thị</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.displayName} 
                onChange={e => setFormData({...formData, displayName: e.target.value})} 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại</Form.Label>
              <Form.Select 
                value={formData.voiceType} 
                onChange={e => setFormData({...formData, voiceType: e.target.value})}
              >
                <option value="narrator">Người kể (Narrator)</option>
                <option value="character">Nhân vật (Character)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select 
                value={formData.gender} 
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>TTS Provider</Form.Label>
              <Form.Select 
                value={formData.ttsProvider} 
                onChange={e => setFormData({...formData, ttsProvider: e.target.value})}
              >
                <option value="edge_tts">Edge TTS</option>
                <option value="google_cloud">Google Cloud</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>TTS Voice ID</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.ttsVoiceId} 
                onChange={e => setFormData({...formData, ttsVoiceId: e.target.value})} 
                placeholder="VD: vi-VN-NamMinhNeural"
                required
              />
            </Form.Group>
            <Form.Check 
              type="checkbox" 
              label="Kích hoạt" 
              checked={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.checked})} 
            />
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
