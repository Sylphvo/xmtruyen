import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, MoreVertical, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { getDocs, deleteDoc, publishDoc, archiveDoc, type IDocument } from '../../api/docsApi';
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

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res = await getDocs(workspaceId, { search: searchTerm, sortBy: 'UpdatedAt', sortDesc: true });
      setDocs(res.data.items);
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

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'PUBLISHED': return 'bg-success';
      case 'DRAFT': return 'bg-secondary';
      case 'IN_REVIEW': return 'bg-warning text-dark';
      case 'ARCHIVED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (showEditor) {
    return (
      <DocsEditor 
        workspaceId={workspaceId} 
        docId={editingDocId} 
        onBack={() => { setShowEditor(false); loadDocs(); }} 
      />
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0" style={{ fontSize: '20px', fontWeight: 600 }}>Tài liệu hệ thống</h2>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => { setEditingDocId(undefined); setShowEditor(true); }}
        >
          <Plus size={16} /> Thêm tài liệu mới
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearch} className="d-flex gap-2">
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
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Tiêu đề</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Người tạo</th>
                <th>Cập nhật lần cuối</th>
                <th className="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">Đang tải dữ liệu...</td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    <FileText size={48} className="mb-2 opacity-50" />
                    <p>Chưa có tài liệu nào. Hãy tạo tài liệu mới!</p>
                  </td>
                </tr>
              ) : (
                docs.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FileText size={18} className="text-primary" />
                        <div>
                          <div className="fw-medium">{doc.title}</div>
                          <div className="text-muted small">{doc.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-info">{doc.type}</span></td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td>{doc.ownerName || 'Hệ thống'}</td>
                    <td>{doc.updatedAt ? format(new Date(doc.updatedAt), 'dd/MM/yyyy HH:mm') : format(new Date(doc.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-light text-primary" 
                          title="Sửa"
                          onClick={() => { setEditingDocId(doc.id); setShowEditor(true); }}
                        >
                          <Edit2 size={16} />
                        </button>
                        {doc.status !== 'PUBLISHED' && (
                          <button className="btn btn-sm btn-light text-success" title="Xuất bản" onClick={() => handlePublish(doc.id)}>
                            <Eye size={16} />
                          </button>
                        )}
                        {doc.status === 'PUBLISHED' && (
                          <button className="btn btn-sm btn-light text-warning" title="Lưu trữ" onClick={() => handleArchive(doc.id)}>
                            <EyeOff size={16} />
                          </button>
                        )}
                        <button className="btn btn-sm btn-light text-danger" title="Xóa" onClick={() => handleDelete(doc.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocsView;
