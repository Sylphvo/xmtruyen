import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { staticPageApi, StaticPage } from '../api/staticPageApi';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export const StaticPages: React.FC = () => {
    const [pages, setPages] = useState<StaticPage[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
    const [formData, setFormData] = useState<Partial<StaticPage>>({});

    const fetchPages = async () => {
        setLoading(true);
        try {
            const data = await staticPageApi.getAllPages();
            setPages(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách trang');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleShowModal = (page?: StaticPage) => {
        if (page) {
            setEditingPage(page);
            setFormData(page);
        } else {
            setEditingPage(null);
            setFormData({ status: 'Published' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.slug || !formData.title || !formData.content) {
            toast.error('Vui lòng nhập đủ các trường bắt buộc (Slug, Tiêu đề, Nội dung)');
            return;
        }

        try {
            if (editingPage?.id) {
                await staticPageApi.updatePage(editingPage.id, formData as StaticPage);
                toast.success('Cập nhật trang thành công');
            } else {
                await staticPageApi.createPage(formData as StaticPage);
                toast.success('Tạo trang thành công');
            }
            setShowModal(false);
            fetchPages();
        } catch (error) {
            toast.error('Lỗi khi lưu trang');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa trang này?')) return;
        try {
            await staticPageApi.deletePage(id);
            toast.success('Đã xóa trang');
            fetchPages();
        } catch (error) {
            toast.error('Lỗi khi xóa trang');
        }
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Quản Lý Các Trang Tĩnh</h4>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Thêm Trang
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Slug</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={4} className="text-center">Đang tải...</td></tr>
                    ) : pages.length === 0 ? (
                        <tr><td colSpan={4} className="text-center">Chưa có dữ liệu</td></tr>
                    ) : (
                        pages.map(page => (
                            <tr key={page.id}>
                                <td>{page.title}</td>
                                <td>{page.slug}</td>
                                <td>{page.status}</td>
                                <td>
                                    <Button variant="sm light" onClick={() => handleShowModal(page)} className="me-2">
                                        <FontAwesomeIcon icon={faPen} />
                                    </Button>
                                    <Button variant="sm danger" onClick={() => handleDelete(page.id!)}>
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
                    <Modal.Title>{editingPage ? 'Sửa Trang' : 'Thêm Trang Mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tiêu đề *</Form.Label>
                            <Form.Control type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Slug *</Form.Label>
                            <Form.Control type="text" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="vd: about, terms, privacy" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung HTML *</Form.Label>
                            <Form.Control as="textarea" rows={10} value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Meta Title (SEO)</Form.Label>
                            <Form.Control type="text" value={formData.metaTitle || ''} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Meta Description (SEO)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.metaDescription || ''} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} />
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
