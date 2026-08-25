import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Check } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { getDocById, createDoc, updateDoc, publishDoc, type SaveDocRequest } from '../../api/docsApi';
import toast from 'react-hot-toast';

interface DocsEditorProps {
  workspaceId: string;
  docId?: number;
  onBack: () => void;
}

const DocsEditor: React.FC<DocsEditorProps> = ({ workspaceId, docId, onBack }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('BUSINESS_RULE');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (docId) {
      loadDoc();
    }
  }, [docId]);

  const loadDoc = async () => {
    setLoading(true);
    try {
      const doc = await getDocById(docId!);
      setTitle(doc.title);
      setSlug(doc.slug);
      setType(doc.type);
      setContent(doc.contentMarkdown || '');
    } catch (err) {
      toast.error('Lỗi tải tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    if (!title || !slug) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và slug');
      return;
    }

    setSaving(true);
    try {
      const req: SaveDocRequest = {
        workspaceId,
        title,
        slug,
        type,
        contentMarkdown: content
      };

      if (docId) {
        await updateDoc(docId, req);
        if (publish) await publishDoc(docId);
        toast.success(publish ? 'Xuất bản thành công' : 'Cập nhật thành công');
      } else {
        const res = await createDoc(req);
        if (publish) await publishDoc(res.id);
        toast.success(publish ? 'Xuất bản thành công' : 'Lưu nháp thành công');
      }
      onBack();
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!docId) {
      setSlug(generateSlug(val));
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  return (
    <div className="container-fluid p-4" data-color-mode="light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light" onClick={onBack}>
            <ArrowLeft size={16} />
          </button>
          <h2 className="m-0" style={{ fontSize: '20px', fontWeight: 600 }}>
            {docId ? 'Chỉnh sửa tài liệu' : 'Tạo tài liệu mới'}
          </h2>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save size={16} /> Lưu nháp
          </button>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Check size={16} /> Xuất bản
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-medium">Tiêu đề</label>
              <input 
                type="text" 
                className="form-control" 
                value={title}
                onChange={handleTitleChange}
                placeholder="Nhập tiêu đề tài liệu..."
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Slug</label>
              <input 
                type="text" 
                className="form-control" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Phân loại</label>
              <select 
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="BUSINESS_RULE">Business Rule</option>
                <option value="API_REFERENCE">API Reference</option>
                <option value="GUIDE">Hướng dẫn</option>
                <option value="ARCHITECTURE_DECISION">Architecture Decision</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label fw-medium">Nội dung</label>
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsEditor;
