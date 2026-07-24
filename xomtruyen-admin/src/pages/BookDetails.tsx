import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrash, faEdit, faImage, faSave, faTimes, faUpload, faFileImage } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import { ResizableHeader } from '../components/ResizableHeader';
import * as bookApi from '../api/bookApi';
import type { IBook } from '../types/book';
import { chapterApi, type ComicChapter, type ComicPage } from '../api/chapterApi';

export const BookDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<IBook | null>(null);
    const [chapters, setChapters] = useState<ComicChapter[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Add/Edit chapter modal state
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState<ComicChapter | null>(null);
    const [chapterForm, setChapterForm] = useState({
        chapterNumber: 1,
        title: '',
        isLocked: false,
        coinPrice: 0
    });

    // Upload pages modal state
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [selectedChapterForPages, setSelectedChapterForPages] = useState<ComicChapter | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [existingPages, setExistingPages] = useState<ComicPage[]>([]);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const bookData = await bookApi.getBookById(id!);
            setBook(bookData);
            
            const chaptersData = await chapterApi.getChaptersByPublication(id!);
            setChapters(chaptersData.data || []);
        } catch (error) {
            toast.error('Lỗi khi tải thông tin sách');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChapter = async () => {
        try {
            if (editingChapter) {
                await chapterApi.updateChapter(editingChapter.id, chapterForm);
                toast.success('Cập nhật chapter thành công');
            } else {
                await chapterApi.createChapter({
                    ...chapterForm,
                    publicationId: id!
                });
                toast.success('Thêm chapter thành công');
            }
            setShowChapterModal(false);
            fetchData();
        } catch (error) {
            toast.error('Lỗi khi lưu chapter');
            console.error(error);
        }
    };

    const handleDeleteChapter = async (chapterId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chapter này?')) {
            try {
                await chapterApi.deleteChapter(chapterId);
                toast.success('Xóa chapter thành công');
                fetchData();
            } catch (error) {
                toast.error('Lỗi khi xóa chapter');
                console.error(error);
            }
        }
    };

    const openChapterModal = (chapter?: ComicChapter) => {
        if (chapter) {
            setEditingChapter(chapter);
            setChapterForm({
                chapterNumber: chapter.chapterNumber,
                title: chapter.title || '',
                isLocked: chapter.isLocked,
                coinPrice: chapter.coinPrice || 0
            });
        } else {
            setEditingChapter(null);
            const nextChapterNum = chapters.length > 0 
                ? Math.max(...chapters.map(c => c.chapterNumber)) + 1 
                : 1;
            setChapterForm({
                chapterNumber: nextChapterNum,
                title: '',
                isLocked: false,
                coinPrice: 0
            });
        }
        setShowChapterModal(true);
    };

    const openPagesModal = async (chapter: ComicChapter) => {
        setSelectedChapterForPages(chapter);
        setShowPagesModal(true);
        try {
            const pages = await chapterApi.getChapterPages(chapter.id);
            setExistingPages(pages.data || []);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách ảnh');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !selectedChapterForPages) return;
        
        const files = Array.from(e.target.files);
        setIsUploading(true);
        setUploadProgress(0);
        
        let successCount = 0;
        const total = files.length;

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // In a real application, you would first upload the file to your storage service
                // and get a URL back. For now, since we only have the AddPage endpoint that takes an ImageUrl,
                // we'll mock the upload process or assume the backend has an upload endpoint we can use.
                // NOTE: The previous UploadController was meant for full book files (Zip/PDF) and cover images.
                // Let's assume we can upload pages using a similar mechanism or just send the file via form data
                // if we modify the API. 
                // Since we only have `chapterApi.addChapterPage` which expects `imageUrl`, we'd normally call 
                // a generic upload endpoint first.
                
                // MOCK UPLOAD for demonstration:
                const mockImageUrl = `/uploads/chapters/${selectedChapterForPages.id}/${file.name}`;
                
                await chapterApi.addChapterPage(selectedChapterForPages.id, {
                    imageUrl: mockImageUrl,
                    orderIndex: existingPages.length + i + 1
                });
                
                successCount++;
                setUploadProgress(Math.round(((i + 1) / total) * 100));
            }
            toast.success(`Đã tải lên ${successCount} ảnh`);
            // Refresh pages
            const pages = await chapterApi.getChapterPages(selectedChapterForPages.id);
            setExistingPages(pages.data || []);
            fetchData(); // Update image count in chapter list
        } catch (error) {
            toast.error('Lỗi khi tải lên ảnh');
            console.error(error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeletePage = async (pageId: string) => {
        if (!selectedChapterForPages) return;
        try {
            await chapterApi.deleteChapterPage(selectedChapterForPages.id, pageId);
            setExistingPages(prev => prev.filter(p => p.id !== pageId));
            toast.success('Đã xóa ảnh');
            fetchData(); // Update image count in chapter list
        } catch (error) {
            toast.error('Lỗi khi xóa ảnh');
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}><div className="spinner-border text-primary" role="status"></div></div>;
    }

    if (!book) return <div>Không tìm thấy thông tin sách.</div>;

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-light border-0 shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} onClick={() => navigate('/books')}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div>
                        <h4 className="mb-0 fw-bold text-dark">{book.title}</h4>
                        <span className="text-muted small">Quản lý Chapters & Hình ảnh</span>
                    </div>
                </div>
                <button className="btn btn-primary px-4 fw-medium shadow-sm d-flex align-items-center gap-2" style={{ backgroundColor: '#5955D1', border: 'none', borderRadius: '8px' }} onClick={() => openChapterModal()}>
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm Chapter
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="table-responsive">
                    <table className="table mb-0 table-hover align-middle">
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #edf2f7' }}>
                                <ResizableHeader width={80} minWidth={60} title="Chap" className="text-muted fw-semibold text-center" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }} />
                                <ResizableHeader width={200} minWidth={150} title="Tiêu đề" className="text-muted fw-semibold" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }} />
                                <ResizableHeader width={120} minWidth={100} title="Số hình ảnh" className="text-muted fw-semibold text-center" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }} />
                                <ResizableHeader width={100} minWidth={80} title="Giá (Coin)" className="text-muted fw-semibold text-center" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }} />
                                <ResizableHeader width={100} minWidth={80} title="Lượt xem" className="text-muted fw-semibold text-center" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }} />
                                <ResizableHeader width={150} minWidth={100} title="Ngày tạo" className="text-muted fw-semibold" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }} />
                                <th style={{ width: '200px', backgroundColor: 'transparent', border: 'none', color: '#6c757d', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600', padding: '16px', textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapters.length > 0 ? chapters.map((chapter) => (
                                <tr key={chapter.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td className="text-center fw-bold text-dark" style={{ padding: '16px' }}>{chapter.chapterNumber}</td>
                                    <td className="fw-medium text-dark" style={{ padding: '16px' }}>{chapter.title || `Chapter ${chapter.chapterNumber}`}</td>
                                    <td className="text-center" style={{ padding: '16px' }}>
                                        <span className="badge rounded-pill bg-light text-primary border" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                            <FontAwesomeIcon icon={faImage} className="me-2" />
                                            {chapter.imageCount} ảnh
                                        </span>
                                    </td>
                                    <td className="text-center" style={{ padding: '16px' }}>{chapter.coinPrice || 0}</td>
                                    <td className="text-center" style={{ padding: '16px' }}>{chapter.viewCount || 0}</td>
                                    <td className="text-muted small" style={{ padding: '16px' }}>
                                        {chapter.createdAt ? new Date(chapter.createdAt).toLocaleString('vi-VN') : '-'}
                                    </td>
                                    <td className="text-center" style={{ padding: '16px' }}>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button className="btn btn-sm btn-light border" onClick={() => openPagesModal(chapter)} title="Quản lý ảnh" style={{ color: '#5955D1', borderRadius: '6px' }}>
                                                <FontAwesomeIcon icon={faUpload} />
                                            </button>
                                            <button className="btn btn-sm btn-light border" onClick={() => openChapterModal(chapter)} title="Sửa" style={{ color: '#4b5563', borderRadius: '6px' }}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="btn btn-sm btn-light border" onClick={() => handleDeleteChapter(chapter.id)} title="Xóa" style={{ color: '#dc3545', borderRadius: '6px' }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">
                                        Chưa có chapter nào. Hãy thêm chapter đầu tiên!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Chapter Modal */}
            <Modal show={showChapterModal} onHide={() => setShowChapterModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-5 fw-bold">{editingChapter ? 'Sửa Chapter' : 'Thêm Chapter'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Số Chapter</label>
                        <input type="number" className="form-control" value={chapterForm.chapterNumber} onChange={e => setChapterForm({...chapterForm, chapterNumber: parseFloat(e.target.value)})} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Tiêu đề (Tùy chọn)</label>
                        <input type="text" className="form-control" placeholder="VD: Khởi đầu mới" value={chapterForm.title} onChange={e => setChapterForm({...chapterForm, title: e.target.value})} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Giá Coin</label>
                        <input type="number" className="form-control" value={chapterForm.coinPrice} onChange={e => setChapterForm({...chapterForm, coinPrice: parseInt(e.target.value)})} />
                    </div>
                    <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" role="switch" checked={chapterForm.isLocked} onChange={e => setChapterForm({...chapterForm, isLocked: e.target.checked})} />
                        <label className="form-check-label">Khóa (Yêu cầu mua)</label>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowChapterModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSaveChapter} style={{ backgroundColor: '#5955D1', border: 'none' }}>
                        <FontAwesomeIcon icon={faSave} className="me-2" /> Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Pages Modal */}
            <Modal show={showPagesModal} onHide={() => !isUploading && setShowPagesModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-5 fw-bold">
                        Quản lý ảnh - Chap {selectedChapterForPages?.chapterNumber}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div 
                        className="upload-drop-zone p-5 text-center rounded-4 mb-4"
                        style={{ 
                            border: '2px dashed #cbd5e1',
                            backgroundColor: '#f8fafc',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                    >
                        <FontAwesomeIcon icon={faUpload} className="fs-1 text-primary mb-3" style={{ opacity: 0.5 }} />
                        <h5 className="fw-bold text-dark">Click để tải lên hình ảnh</h5>
                        <p className="text-muted mb-0 small">Hỗ trợ JPG, PNG, WEBP (Có thể chọn nhiều file)</p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange} 
                            accept="image/*"
                            multiple
                        />
                        {isUploading && (
                            <div className="mt-4">
                                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} variant="success" style={{ height: '20px' }} />
                                <p className="text-muted small mt-2 mb-0">Đang tải lên...</p>
                            </div>
                        )}
                    </div>

                    <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
                        <span>Hình ảnh đã tải lên ({existingPages.length})</span>
                    </h6>
                    
                    <div className="row g-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {existingPages.length > 0 ? existingPages.map((page, index) => (
                            <div key={page.id} className="col-4 col-md-3">
                                <div className="card border-0 shadow-sm rounded-3 overflow-hidden h-100 position-relative">
                                    <div className="position-absolute top-0 start-0 m-1 bg-dark text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '24px', height: '24px', fontSize: '12px', opacity: 0.8, zIndex: 1 }}>
                                        {index + 1}
                                    </div>
                                    <button 
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle d-flex justify-content-center align-items-center" 
                                        style={{ width: '24px', height: '24px', zIndex: 1, padding: 0 }}
                                        onClick={() => handleDeletePage(page.id)}
                                    >
                                        <FontAwesomeIcon icon={faTimes} style={{ fontSize: '12px' }} />
                                    </button>
                                    <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: '120px' }}>
                                        <FontAwesomeIcon icon={faFileImage} className="text-muted fs-1" />
                                        {/* In real app, you would show the image here: */}
                                        {/* <img src={page.imageUrl} className="w-100 h-100 object-fit-cover" /> */}
                                    </div>
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted text-truncate d-block" style={{ fontSize: '11px' }}>
                                            {page.imageUrl.split('/').pop()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-12 text-center text-muted py-4">
                                Chưa có hình ảnh nào trong chapter này.
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={() => setShowPagesModal(false)} disabled={isUploading}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
