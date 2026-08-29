import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { faqApi, type FaqItem } from '../api/staticPageApi';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export const FaqManagement: React.FC = () => {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
    const [formData, setFormData] = useState<Partial<FaqItem>>({});

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const data = await faqApi.getAllFaqs();
            setFaqs(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách FAQ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleShowModal = (faq?: FaqItem) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData(faq);
        } else {
            setEditingFaq(null);
            setFormData({ isActive: true, orderIndex: 0 });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.category || !formData.question || !formData.answer) {
            toast.error('Vui lòng nhập Danh mục, Câu hỏi và Câu trả lời');
            return;
        }

        try {
            if (editingFaq?.id) {
                await faqApi.updateFaq(editingFaq.id, formData as FaqItem);
                toast.success('Cập nhật FAQ thành công');
            } else {
                await faqApi.createFaq(formData as FaqItem);
                toast.success('Thêm FAQ thành công');
            }
            setShowModal(false);
            fetchFaqs();
        } catch (error) {
            toast.error('Lỗi khi lưu FAQ');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa FAQ này?')) return;
        try {
            await faqApi.deleteFaq(id);
            toast.success('Đã xóa FAQ');
            fetchFaqs();
        } catch (error) {
            toast.error('Lỗi khi xóa FAQ');
        }
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Quản Lý Câu Hỏi Thường Gặp (FAQ)</h4>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Thêm FAQ
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Danh mục</th>
                        <th>Câu hỏi</th>
                        <th>Thứ tự</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={5} className="text-center">Đang tải...</td></tr>
                    ) : faqs.length === 0 ? (
                        <tr><td colSpan={5} className="text-center">Chưa có dữ liệu</td></tr>
                    ) : (
                        faqs.map(faq => (
                            <tr key={faq.id}>
                                <td>{faq.category}</td>
                                <td>{faq.question}</td>
                                <td>{faq.orderIndex}</td>
                                <td>{faq.isActive ? 'Bật' : 'Tắt'}</td>
                                <td>
                                    <Button variant="sm light" onClick={() => handleShowModal(faq)} className="me-2">
                                        <FontAwesomeIcon icon={faPen} />
                                    </Button>
                                    <Button variant="sm danger" onClick={() => handleDelete(faq.id!)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingFaq ? 'Sửa FAQ' : 'Thêm FAQ Mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Danh mục *</Form.Label>
                            <Form.Control type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="vd: account, payment, reading" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Câu hỏi *</Form.Label>
                            <Form.Control as="textarea" rows={2} value={formData.question || ''} onChange={e => setFormData({ ...formData, question: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Câu trả lời HTML *</Form.Label>
                            <Form.Control as="textarea" rows={6} value={formData.answer || ''} onChange={e => setFormData({ ...formData, answer: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thứ tự hiển thị</Form.Label>
                            <Form.Control type="number" value={formData.orderIndex || 0} onChange={e => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check type="switch" id="custom-switch" label="Trạng thái hiển thị (Bật/Tắt)" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
