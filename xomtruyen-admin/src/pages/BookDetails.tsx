import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrash, faEdit, faImage, faSave, faTimes, faUpload, faFileImage, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import { ResizableHeader } from '../components/ResizableHeader';
import { BulkUploadModal } from '../components/BulkUploadModal';
import * as bookApi from '../api/bookApi';
import type { IBook } from '../types/book';
import { chapterApi, bookChapterApi, type ComicChapter, type ComicPage } from '../api/chapterApi';
import { uploadChapterPage } from '../api/uploadApi';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

export const BookDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<IBook | null>(null);
    const [chapters, setChapters] = useState<any[]>([]); // Can be ComicChapter or BookChapter
    const [loading, setLoading] = useState(true);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // 20 chapters per page
    const totalPages = Math.ceil(chapters.length / itemsPerPage);
    const currentChapters = chapters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    // Bulk upload modal state
    const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

    // Add/Edit chapter modal state
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState<any | null>(null);
    const [chapterForm, setChapterForm] = useState({
        chapterNumber: 1,
        title: '',
        content: '',
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

    const isTextBook = book?.formatType === 1;

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
            
            if (bookData.formatType === 1) {
                const chaptersData = await bookChapterApi.getChaptersByPublication(id!);
                setChapters(chaptersData.data || []);
            } else {
                const chaptersData = await chapterApi.getChaptersByPublication(id!);
                setChapters(chaptersData.data || []);
            }
        } catch (error) {
            toast.error('Lỗi khi tải thông tin sách');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChapter = async () => {
        try {
            if (isTextBook) {
                const dataToSave = {
                    ...chapterForm,
                    publicationId: id!
                };
                if (editingChapter) {
                    await bookChapterApi.updateChapter(editingChapter.id, dataToSave);
                    toast.success('Cập nhật chapter thành công');
                } else {
                    await bookChapterApi.createChapter(dataToSave);
                    toast.success('Thêm chapter thành công');
                }
            } else {
                const dataToSave = {
                    chapterNumber: chapterForm.chapterNumber,
                    title: chapterForm.title,
                    isLocked: chapterForm.isLocked,
                    coinPrice: chapterForm.coinPrice,
                    publicationId: id!
                };
                if (editingChapter) {
                    await chapterApi.updateChapter(editingChapter.id, dataToSave);
                    toast.success('Cập nhật chapter thành công');
                } else {
                    await chapterApi.createChapter(dataToSave);
                    toast.success('Thêm chapter thành công');
                }
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
                if (isTextBook) {
                    await bookChapterApi.deleteChapter(chapterId);
                } else {
                    await chapterApi.deleteChapter(chapterId);
                }
                toast.success('Xóa chapter thành công');
                fetchData();
            } catch (error) {
                toast.error('Lỗi khi xóa chapter');
                console.error(error);
            }
        }
    };

    const handleDeleteAllChapters = async () => {
        if (!chapters || chapters.length === 0) return;
        if (window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa TOÀN BỘ chapter của truyện này? Hành động này không thể hoàn tác!')) {
            try {
                if (isTextBook) {
                    await bookChapterApi.deleteAllChapters(id!);
                } else {
                    await chapterApi.deleteAllChapters(id!);
                }
                toast.success('Đã xóa toàn bộ chapter thành công');
                setCurrentPage(1);
                fetchData();
            } catch (error) {
                toast.error('Lỗi khi xóa toàn bộ chapter');
                console.error(error);
            }
        }
    };

    const openChapterModal = (chapter?: any) => {
        if (chapter) {
            setEditingChapter(chapter);
            setChapterForm({
                chapterNumber: chapter.chapterNumber,
                title: chapter.title || '',
                content: chapter.content || '',
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
                content: '',
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
                let uploadedUrl = `/uploads/chapters/${selectedChapterForPages.id}/${file.name}`;
                try {
                    const uploadRes = await uploadChapterPage(file, selectedChapterForPages.id);
                    if (uploadRes && uploadRes.url) {
                        uploadedUrl = uploadRes.url;
                    }
                } catch (upErr) {
                    console.warn('Direct upload failed, using fallback path:', upErr);
                }

                await chapterApi.addChapterPage(selectedChapterForPages.id, {
                    imageUrl: uploadedUrl,
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
                <div className="d-flex align-items-center gap-2">
                    {chapters.length > 0 && (
                        <button
                            className="btn btn-outline-danger px-3 fw-medium shadow-sm d-flex align-items-center gap-2"
                            style={{ borderRadius: '8px' }}
                            onClick={handleDeleteAllChapters}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            Xóa tất cả Chapter
                        </button>
                    )}
                    <button
                        className="btn btn-outline-primary px-3 fw-medium shadow-sm d-flex align-items-center gap-2"
                        style={{ borderRadius: '8px' }}
                        onClick={() => setShowBulkUploadModal(true)}
                    >
                        <FontAwesomeIcon icon={faCloudUploadAlt} />
                        Tải lên hàng loạt (Zip/CBZ)
                    </button>
                    <button
                        className="btn btn-primary px-4 fw-medium shadow-sm d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#5955D1', border: 'none', borderRadius: '8px' }}
                        onClick={() => openChapterModal()}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Thêm Chapter
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="table-responsive">
                    <table className="table mb-0 table-hover align-middle">
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #edf2f7' }}>
                                <ResizableHeader initialWidth={80} minWidth={60} className="text-muted fw-semibold text-center" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }}>Chap</ResizableHeader>
                                <ResizableHeader initialWidth={200} minWidth={150} className="text-muted fw-semibold" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }}>Tiêu đề</ResizableHeader>
                                <ResizableHeader initialWidth={120} minWidth={100} className="text-muted fw-semibold text-center" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }}>Số hình ảnh</ResizableHeader>
                                <ResizableHeader initialWidth={100} minWidth={80} className="text-muted fw-semibold text-center" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }}>Giá (Coin)</ResizableHeader>
                                <ResizableHeader initialWidth={100} minWidth={80} className="text-muted fw-semibold text-center" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }}>Lượt xem</ResizableHeader>
                                <ResizableHeader initialWidth={150} minWidth={100} className="text-muted fw-semibold" style={{ fontSize: '13px', textTransform: 'uppercase', padding: '16px' }}>Ngày tạo</ResizableHeader>
                                <th style={{ width: '200px', backgroundColor: 'transparent', border: 'none', color: '#6c757d', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600', padding: '16px', textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentChapters.length > 0 ? currentChapters.map((chapter) => (
                                <tr key={chapter.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td className="text-center fw-bold text-dark" style={{ padding: '16px' }}>{chapter.chapterNumber}</td>
                                    <td className="fw-medium text-dark" style={{ padding: '16px' }}>{chapter.title || `Chapter ${chapter.chapterNumber}`}</td>
                                    <td className="text-center" style={{ padding: '16px' }}>
                                        {isTextBook ? (
                                            <span className="badge rounded-pill bg-light text-primary border" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                                                Truyện Chữ
                                            </span>
                                        ) : (
                                            <span className="badge rounded-pill bg-light text-primary border" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                                <FontAwesomeIcon icon={faImage} className="me-2" />
                                                {chapter.imageCount} ảnh
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-center" style={{ padding: '16px' }}>{chapter.coinPrice || 0}</td>
                                    <td className="text-center" style={{ padding: '16px' }}>{chapter.viewCount || 0}</td>
                                    <td className="text-muted small" style={{ padding: '16px' }}>
                                        {chapter.createdAt ? new Date(chapter.createdAt).toLocaleString('vi-VN') : '-'}
                                    </td>
                                    <td className="text-center" style={{ padding: '16px' }}>
                                        <div className="d-flex gap-2 justify-content-center">
                                            {!isTextBook && (
                                                <button className="btn btn-sm btn-light border" onClick={() => openPagesModal(chapter)} title="Quản lý ảnh" style={{ color: '#5955D1', borderRadius: '6px' }}>
                                                    <FontAwesomeIcon icon={faUpload} />
                                                </button>
                                            )}
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
                    
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center py-3 bg-white border-top">
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-sm btn-outline-secondary" 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                >
                                    Trước
                                </button>
                                <span className="d-flex align-items-center px-3 small fw-medium">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button 
                                    className="btn btn-sm btn-outline-secondary" 
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chapter Modal */}
            <Modal show={showChapterModal} onHide={() => setShowChapterModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-5 fw-bold">{editingChapter ? 'Sửa Chapter' : 'Thêm Chapter'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-medium">Số Chapter</label>
                            <input type="number" step="any" className="form-control" value={chapterForm.chapterNumber} onChange={e => setChapterForm({...chapterForm, chapterNumber: parseFloat(e.target.value) || 0})} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-medium">Giá Coin</label>
                            <input type="number" className="form-control" value={chapterForm.coinPrice} onChange={e => setChapterForm({...chapterForm, coinPrice: parseInt(e.target.value) || 0})} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Tiêu đề (Tùy chọn)</label>
                        <input type="text" className="form-control" placeholder="VD: Khởi đầu mới" value={chapterForm.title} onChange={e => setChapterForm({...chapterForm, title: e.target.value})} />
                    </div>
                    {isTextBook && (
                        <div className="mb-3">
                            <label className="form-label fw-medium">Nội dung chương (Sách)</label>
                            <textarea 
                                className="form-control" 
                                rows={15}
                                placeholder="Nhập nội dung chương..." 
                                value={chapterForm.content} 
                                onChange={e => setChapterForm({...chapterForm, content: e.target.value})}
                            ></textarea>
                        </div>
                    )}
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
                                    <div className="bg-light d-flex justify-content-center align-items-center position-relative overflow-hidden" style={{ height: '120px' }}>
                                        <FontAwesomeIcon icon={faFileImage} className="text-muted fs-1 position-absolute" style={{ opacity: 0.3 }} />
                                        <img 
                                            src={page.imageUrl.startsWith('http') ? page.imageUrl : `http://localhost:5172/${page.imageUrl.startsWith('/') ? page.imageUrl.slice(1) : page.imageUrl}`} 
                                            alt={`Page ${index + 1}`} 
                                            className="w-100 h-100 position-relative" 
                                            style={{ objectFit: 'cover', zIndex: 1 }} 
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                        />
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

            {/* Bulk Upload Modal */}
            <BulkUploadModal
                show={showBulkUploadModal}
                onHide={() => setShowBulkUploadModal(false)}
                publicationId={id!}
                bookTitle={book?.title}
                onSuccess={() => {
                    fetchData();
                }}
            />
        </div>
    );
};
