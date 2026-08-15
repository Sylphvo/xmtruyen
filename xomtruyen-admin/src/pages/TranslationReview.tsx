import React, { useState, useEffect } from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Check, X, ArrowRight, Save, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api/translationApi';

export const TranslationReview: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  
  const [chapter, setChapter] = useState<api.TranslationChapter | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mocks pages and active page. In a real app, this comes from API `chapter.pages`
  const [activePageIdx, setActivePageIdx] = useState(0);

  useEffect(() => {
    if (chapterId) fetchChapter(chapterId);
  }, [chapterId]);

  const fetchChapter = async (id: string) => {
    try {
      const data = await api.getTranslationChapter(id);
      
      // Mock data for UI demonstration since we don't have python worker yet
      if (!data.pages || data.pages.length === 0) {
        data.pages = [
          {
            id: 'page1',
            chapterId: id,
            pageNumber: 1,
            rawImageUrl: 'https://via.placeholder.com/600x800.png?text=RAW+Image+(Chinese)',
            translatedImageUrl: 'https://via.placeholder.com/600x800.png?text=Translated+Image+(Vietnamese)',
            ocrStatus: 'done',
            typesetStatus: 'done',
            textBlocks: [
              { id: 'tb1', pageId: 'page1', bboxX: 100, bboxY: 100, bboxWidth: 200, bboxHeight: 80, originalText: '俺は最強だ！', translatedText: 'Ta là mạnh nhất!', textType: 'dialog', fontStyle: 'bold', ocrConfidence: 0.95, isManualEdit: false },
              { id: 'tb2', pageId: 'page1', bboxX: 100, bboxY: 300, bboxWidth: 150, bboxHeight: 50, originalText: 'ドドドド', translatedText: 'ĐÙNG ĐÙNG', textType: 'sfx', fontStyle: 'bold', ocrConfidence: 0.8, isManualEdit: false },
            ]
          }
        ];
      }
      
      setChapter(data);
    } catch (error) {
      toast.error('Lỗi khi tải Chapter');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5">Đang tải...</div>;
  if (!chapter) return <div className="text-center p-5">Không tìm thấy Chapter!</div>;

  const activePage = chapter.pages?.[activePageIdx];

  return (
    <div className="d-flex flex-column" style={{ height: 'calc(100vh - 60px)', backgroundColor: '#0f0f1a', color: '#e0e0e0', margin: '-20px', padding: '10px' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-2 mb-2 bg-dark rounded">
        <div className="d-flex align-items-center">
          <Button variant="link" className="text-light p-0 me-3" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h5 className="mb-0 text-white">Chương {chapter.chapterNumber}</h5>
            <small className="text-muted">Review Translation Quality</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-danger" size="sm"><X size={16} className="me-1" /> Reject</Button>
          <Button variant="success" size="sm"><Check size={16} className="me-1" /> Approve Chapter</Button>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="d-flex flex-grow-1 gap-3 overflow-hidden">
        
        {/* Left: Images (RAW vs Translated) */}
        <div className="flex-grow-1 d-flex flex-column rounded bg-dark p-2" style={{ width: '60%' }}>
          <div className="d-flex justify-content-center mb-2 gap-3 text-muted small">
            <span className="text-warning">RAW (Bản gốc)</span>
            <ArrowRight size={16} />
            <span className="text-info">TYPESET (Bản dịch)</span>
          </div>
          
          <div className="d-flex flex-grow-1 gap-2 overflow-auto" style={{ border: '1px solid #333' }}>
            {activePage ? (
              <>
                <div className="flex-fill position-relative d-flex justify-content-center bg-black">
                  <img src={activePage.rawImageUrl} alt="RAW" style={{ objectFit: 'contain', maxWidth: '100%', height: '100%' }} />
                </div>
                <div className="flex-fill position-relative d-flex justify-content-center bg-black" style={{ borderLeft: '2px solid #444' }}>
                  <img src={activePage.translatedImageUrl} alt="Translated" style={{ objectFit: 'contain', maxWidth: '100%', height: '100%' }} />
                </div>
              </>
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                <ImageIcon size={48} />
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="d-flex justify-content-center mt-2 gap-2">
            <Button variant="secondary" size="sm" disabled={activePageIdx === 0} onClick={() => setActivePageIdx(p => p - 1)}>Prev Page</Button>
            <span className="align-self-center mx-2">Trang {activePageIdx + 1} / {chapter.pages?.length || 0}</span>
            <Button variant="secondary" size="sm" disabled={activePageIdx === (chapter.pages?.length || 1) - 1} onClick={() => setActivePageIdx(p => p + 1)}>Next Page</Button>
          </div>
        </div>

        {/* Right: Text Blocks Editor */}
        <div className="rounded p-3 overflow-auto" style={{ width: '40%', backgroundColor: '#1a1a2e', border: '1px solid #333' }}>
          <h6 className="text-info mb-3 border-bottom border-secondary pb-2">VĂN BẢN TRÊN TRANG (TEXT BLOCKS)</h6>
          
          {activePage?.textBlocks?.map((block, idx) => (
            <div key={block.id} className="mb-4 p-3 rounded" style={{ backgroundColor: '#12121f', border: '1px solid #333' }}>
              <div className="d-flex justify-content-between mb-2">
                <Badge bg="secondary">Block #{idx + 1}</Badge>
                <Badge bg={block.ocrConfidence && block.ocrConfidence > 0.9 ? 'success' : 'warning'}>
                  OCR: {block.ocrConfidence ? Math.round(block.ocrConfidence * 100) : 0}%
                </Badge>
              </div>
              
              <div className="mb-2">
                <div className="small text-muted mb-1">Gốc (RAW):</div>
                <div className="p-2 rounded text-light" style={{ backgroundColor: '#222', fontFamily: 'monospace' }}>
                  {block.originalText}
                </div>
              </div>
              
              <div>
                <div className="small text-muted mb-1 d-flex justify-content-between">
                  <span>Dịch (Translated):</span>
                  <span className="text-info" style={{ cursor: 'pointer' }}><Save size={12} className="me-1"/>Lưu</span>
                </div>
                <Form.Control 
                  as="textarea" 
                  rows={2}
                  defaultValue={block.translatedText}
                  className="bg-dark text-white border-secondary"
                />
              </div>
            </div>
          ))}

          {(!activePage?.textBlocks || activePage.textBlocks.length === 0) && (
            <div className="text-center text-muted p-5">
              Không có text block nào được nhận diện trên trang này.
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="primary" size="sm" className="w-100">
              🔄 Re-Typeset Page (Render lại ảnh)
            </Button>
            <div className="small text-muted mt-2">
              Bấm re-typeset sau khi chỉnh sửa text để cập nhật ảnh bên trái.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
