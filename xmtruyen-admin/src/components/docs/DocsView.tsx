import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Check, X, Eye, EyeOff } from 'lucide-react';
import { getDocs, deleteDoc, publishDoc, archiveDoc, createDoc, type IDocument } from '../../api/docsApi';
import DocsEditor from './DocsEditor';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface DocsViewProps {
  workspaceId: string;
}

const DocsView: React.FC<DocsViewProps> = ({ workspaceId }) => {
  const [docs, setDocs] = useState<IDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingDocId, setEditingDocId] = useState<number | undefined>();
  
  // Inline Add state
  const [isAdding, setIsAdding] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState('BUSINESS_RULE');
  const [isSavingInline, setIsSavingInline] = useState(false);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res = await getDocs(workspaceId, { search: searchTerm, sortBy: 'UpdatedAt', sortDesc: true });
      setDocs((res as any).items || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải tài liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [workspaceId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDocs();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      await deleteDoc(id);
      toast.success('Xóa tài liệu thành công');
      loadDocs();
    } catch (err) {
      toast.error('Lỗi khi xóa tài liệu');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishDoc(id);
      toast.success('Xuất bản tài liệu thành công');
      loadDocs();
    } catch (err) {
      toast.error('Lỗi khi xuất bản tài liệu');
    }
  };
  
  const handleArchive = async (id: number) => {
    try {
      await archiveDoc(id);
      toast.success('Lưu trữ tài liệu thành công');
      loadDocs();
    } catch (err) {
      toast.error('Lỗi khi lưu trữ tài liệu');
    }
  };

  const handleInlineSave = async () => {
    if (!newDocTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }
    setIsSavingInline(true);
    try {
      const slug = newDocTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const req = {
        workspaceId,
        title: newDocTitle,
        slug: slug || 'doc-' + Date.now(),
        type: newDocType,
        contentMarkdown: ''
      };
      await createDoc(req);
      toast.success('Thêm tài liệu thành công');
      setIsAdding(false);
      setNewDocTitle('');
      setNewDocType('BUSINESS_RULE');
      loadDocs();
    } catch (err) {
      toast.error('Lỗi khi thêm tài liệu');
    } finally {
      setIsSavingInline(false);
    }
  };



  return (
    <div className="container-fluid p-4 d-flex flex-column gap-4">
      {/* Phía trên: Danh sách tài liệu */}
      <div className="w-100">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom pt-3 pb-3 d-flex justify-content-between align-items-center">
            <h2 className="m-0" style={{ fontSize: '18px', fontWeight: 600 }}>Tài liệu hệ thống</h2>
            <button 
              className="btn btn-sm btn-primary d-flex align-items-center gap-1"
              onClick={() => { setIsAdding(true); setNewDocTitle(''); setNewDocType('BUSINESS_RULE'); }}
            >
              <Plus size={16} /> Thêm mới
            </button>
          </div>
          
          <div className="card-body p-3">
            <form onSubmit={handleSearch} className="d-flex gap-2 mb-3">
              <div className="position-relative flex-grow-1">
                <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={16} />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-outline-secondary">Tìm kiếm</button>
            </form>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Loại</th>
                    <th>Trạng thái</th>
                    <th>Cập nhật lần cuối</th>
                    <th className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isAdding && (
                    <tr style={{ backgroundColor: '#ebf2fc' }}>
                      <td className="p-2">
                        <input
                          type="text"
                          className="form-control form-control-sm border-primary"
                          placeholder="Nhập tiêu đề tài liệu..."
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleInlineSave();
                            if (e.key === 'Escape') setIsAdding(false);
                          }}
                          disabled={isSavingInline}
                        />
                      </td>
                      <td className="p-2">
                        <select 
                          className="form-select form-select-sm"
                          value={newDocType}
                          onChange={(e) => setNewDocType(e.target.value)}
                          disabled={isSavingInline}
                        >
                          <option value="BUSINESS_RULE">Business Rule</option>
                          <option value="API_REFERENCE">API Reference</option>
                          <option value="GUIDE">Hướng dẫn</option>
                          <option value="ARCHITECTURE_DECISION">Architecture Decision</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <span className="jira-status-toggle no-arrow text-secondary" style={{ display: 'inline-block', cursor: 'default' }}>DRAFT</span>
                      </td>
                      <td className="p-2 text-muted">-</td>
                      <td className="p-2 text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button 
                            className="btn btn-sm btn-light border d-flex align-items-center justify-content-center p-1" 
                            style={{ width: '28px', height: '28px', color: '#198754' }}
                            onClick={() => handleInlineSave()}
                            disabled={isSavingInline}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-light border d-flex align-items-center justify-content-center p-1" 
                            style={{ width: '28px', height: '28px', color: '#6c757d' }}
                            onClick={() => setIsAdding(false)}
                            disabled={isSavingInline}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">Đang tải dữ liệu...</td>
                    </tr>
                  ) : docs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        <FileText size={48} className="mb-2 opacity-50" />
                        <p>Chưa có tài liệu nào. Hãy tạo tài liệu mới!</p>
                      </td>
                    </tr>
                  ) : (
                    docs.map((doc) => (
                      <tr 
                        key={doc.id} 
                        className={editingDocId === doc.id ? 'table-active' : ''}
                        onClick={() => { setEditingDocId(doc.id); setShowEditor(true); }}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FileText size={18} className="text-primary" />
                            <div>
                              <div className="fw-medium">{doc.title}</div>
                              <div className="text-muted small">{doc.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="jira-status-toggle no-arrow" style={{ display: 'inline-block', cursor: 'default' }}>{doc.type}</span>
                        </td>
                        <td>
                          <span className="jira-status-toggle no-arrow" style={{ display: 'inline-block', cursor: 'default' }}>
                            {doc.status}
                          </span>
                        </td>
                        <td>{doc.updatedAt ? format(new Date(doc.updatedAt), 'dd/MM/yyyy HH:mm') : format(new Date(doc.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                        <td className="text-end" onClick={e => e.stopPropagation()}>
                          <button 
                            className="btn btn-sm btn-link text-danger text-decoration-none px-2" 
                            onClick={() => handleDelete(doc.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Phía dưới: Chi tiết/Editor */}
      {showEditor && (
        <div className="w-100" style={{ minHeight: '600px' }}>
          <div className="card shadow-sm border-0 h-100">
            <DocsEditor 
              workspaceId={workspaceId} 
              docId={editingDocId} 
              onBack={() => { setShowEditor(false); loadDocs(); }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocsView;
