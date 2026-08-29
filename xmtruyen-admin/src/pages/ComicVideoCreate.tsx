import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { comicVideoApi } from '../api/comicVideoApi';

export const ComicVideoCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    publicationId: 'b7b80a2b-28de-47af-bf15-188b77073eb4', // Mock ID
    chapterIds: ['chap-1', 'chap-2'],
    language: 'vi-VN',
    voiceId: 'vi-VN-HoaiMyNeural',
    speechRate: '+0%',
    resolution: '1080p',
    transition: 'kenburns',
    narrationSource: 'text_chapter',
    addSubtitles: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await comicVideoApi.createTask(formData);
      if (res.data?.success) {
        navigate('/comic-video');
      } else {
        alert(res.data?.message || 'Lỗi tạo task');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối API');
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Tạo Video Truyện Tranh (Comic)</h2>
      
      <div className="card bg-dark text-light border-secondary">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Truyện</label>
                <input type="text" className="form-control bg-secondary text-light border-dark" disabled value="Đấu Phá Thương Khung (Demo ID)" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Nguồn Lời Thoại (Narration)</label>
                <select className="form-select bg-secondary text-light border-dark" 
                        value={formData.narrationSource} onChange={e => setFormData({...formData, narrationSource: e.target.value})}>
                  <option value="text_chapter">Lấy từ truyện chữ tương ứng</option>
                  <option value="ocr">AI đọc chữ trên ảnh (OCR)</option>
                  <option value="manual">Nhập tay</option>
                </select>
              </div>
            </div>

            <h5 className="mt-4 text-info">Cấu hình Giọng Đọc (TTS)</h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Ngôn ngữ</label>
                <select className="form-select bg-secondary text-light border-dark" 
                        value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                  <option value="vi-VN">Tiếng Việt</option>
                  <option value="en-US">English</option>
                  <option value="zh-CN">Chinese</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Giọng đọc</label>
                <select className="form-select bg-secondary text-light border-dark" 
                        value={formData.voiceId} onChange={e => setFormData({...formData, voiceId: e.target.value})}>
                  <option value="vi-VN-HoaiMyNeural">Nữ - Hoài My</option>
                  <option value="vi-VN-NamMinhNeural">Nam - Nam Minh</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Tốc độ đọc</label>
                <select className="form-select bg-secondary text-light border-dark" 
                        value={formData.speechRate} onChange={e => setFormData({...formData, speechRate: e.target.value})}>
                  <option value="-20%">Chậm (0.8x)</option>
                  <option value="+0%">Bình thường (1.0x)</option>
                  <option value="+20%">Nhanh (1.2x)</option>
                </select>
              </div>
            </div>

            <h5 className="mt-4 text-warning">Cấu hình Video & Hiệu ứng</h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Độ phân giải</label>
                <select className="form-select bg-secondary text-light border-dark" 
                        value={formData.resolution} onChange={e => setFormData({...formData, resolution: e.target.value})}>
                  <option value="1080p">1080p (1920x1080)</option>
                  <option value="720p">720p (1280x720)</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Hiệu ứng chuyển cảnh</label>
                <select className="form-select bg-secondary text-light border-dark" 
                        value={formData.transition} onChange={e => setFormData({...formData, transition: e.target.value})}>
                  <option value="kenburns">Ken Burns (Pan & Zoom)</option>
                  <option value="crossfade">Crossfade (Lồng mờ)</option>
                  <option value="none">Không có (Cut)</option>
                </select>
              </div>
            </div>

            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="addSubtitles" 
                     checked={formData.addSubtitles} onChange={e => setFormData({...formData, addSubtitles: e.target.checked})} />
              <label className="form-check-label" htmlFor="addSubtitles">
                Tự động chèn Phụ đề (Hardsub)
              </label>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Bắt đầu Convert'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/comic-video')}>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
