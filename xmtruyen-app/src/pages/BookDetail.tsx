import React, { useMemo, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonTitle,
  useIonRouter,
} from '@ionic/react';
import { 
  chevronBackOutline, 
  ellipsisHorizontal, 
  heart, 
  shareOutline, 
  chatboxEllipsesOutline,
  documentTextOutline,
  timeOutline,
  star
} from 'ionicons/icons';
import { useParams } from 'react-router';
import { mockBooks } from '../data/mockData';
import './BookDetail.css';

const BookDetail: React.FC = () => {
  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'intro' | 'discuss' | 'review'>('intro');
  
  const book = useMemo(() => {
    return mockBooks.find(b => b.id === Number(id)) || mockBooks[0];
  }, [id]);

  // Use the image from the design or fallback to mock
  const coverImage = 'https://m.media-amazon.com/images/I/71UypkUjStL._AC_UF1000,1000_QL80_.jpg'; // Think and Grow Rich placeholder

  return (
    <IonPage className="book-detail-page">
      <IonHeader className="ion-no-border book-detail-header">
        <IonToolbar className="book-detail-toolbar">
          <IonButton fill="clear" slot="start" className="header-icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="header-title">Chi tiết sách</IonTitle>
          <IonButton fill="clear" slot="end" className="header-icon-btn">
            <IonIcon icon={ellipsisHorizontal} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="book-detail-content">
        <div className="top-background-section">
          {/* Blurred Background */}
          <div 
            className="blurred-bg" 
            style={{ backgroundImage: `url(${coverImage})` }}
          ></div>
          <div className="blurred-overlay"></div>

          {/* Book Info Header */}
          <div className="book-header-info">
            <div className="book-cover-large">
              <img src={coverImage} alt="Hệ thống hoạch định" />
            </div>
            
            <h2 className="book-title-main">Hệ thống hoạch định nguồn lực Doanh nghiệp (ERP)</h2>
            <p className="book-author-main">Vũ Quốc Thông (chủ biên)</p>

            {/* Stats Pill */}
            <div className="stats-pill">
              <div className="stat-item">
                <IonIcon icon={star} className="text-orange" />
                <span><strong>4.8</strong>/5</span>
              </div>
              <div className="stat-divider">|</div>
              <div className="stat-item">
                <IonIcon icon={chatboxEllipsesOutline} className="text-gray" />
                <span><strong>25</strong></span>
              </div>
              <div className="stat-divider">|</div>
              <div className="stat-item">
                <IonIcon icon={documentTextOutline} className="text-gray" />
                <span><strong>90</strong></span>
              </div>
              <div className="stat-divider">|</div>
              <div className="stat-item">
                <IonIcon icon={timeOutline} className="text-gray" />
                <span><strong>5</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet Content */}
        <div className="bottom-sheet-content">
          {/* Tabs */}
          <div className="tabs-row">
            <div 
              className={`tab-item ${activeTab === 'intro' ? 'active' : ''}`}
              onClick={() => setActiveTab('intro')}
            >
              Giới thiệu
            </div>
            <div 
              className={`tab-item ${activeTab === 'discuss' ? 'active' : ''}`}
              onClick={() => setActiveTab('discuss')}
            >
              Thảo luận
            </div>
            <div 
              className={`tab-item ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              Đánh giá
            </div>
          </div>

          {activeTab === 'intro' && (
            <div className="tab-content">
              <h3 className="section-heading">Thông tin chi tiết</h3>
              
              <div className="details-grid">
                <div className="detail-row">
                  <span className="detail-label">Tên sách</span>
                  <span className="detail-value uppercase">HỆ THỐNG HOẠCH ĐỊNH NGUỒN LỰC DOANH NGHIỆP (ERP)</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tác giả</span>
                  <span className="detail-value">Vũ Quốc Thông (chủ biên)</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tác quyền</span>
                  <span className="detail-value">Trường Đại học Mở TP.HCM</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nhà xuất bản</span>
                  <span className="detail-value">Thông tin truyền thông</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Năm xuất bản</span>
                  <span className="detail-value">2021</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Số trang</span>
                  <span className="detail-value">400</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Dung lượng</span>
                  <span className="detail-value">13,69 (MB)</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Thể loại</span>
                  <span className="detail-value text-blue">Tài chính Doanh nghiệp, Giáo dục</span>
                </div>
              </div>

              <h3 className="section-heading mt-24">Giới thiệu</h3>
              <div className="intro-text">
                <p>
                  Trong bối cảnh của chuyển đổi số trên toàn cầu cũng như tại Việt Nam, các nhà quản lý mong muốn duy trì lợi thế cạnh tranh và phát triển bền vững cần chú trọng đến hoàn thiện hạ tầng công nghệ thông tin toàn doanh nghiệp.
                </p>
                <p>
                  Quyển học liệu Hệ thống hoạch định nguồn lực doanh nghiệp (ERP) được xuất bản nhằm giúp cho người học trang bị phần kiến thức nền tảng về hệ thống thông tin tích hợp trong tổ chức kinh doanh cùng với những kỹ năng tiếp cận hệ thống ERP, kiểm soát hệ thống, đề xuất quy trình hoạt động, khái lược về một số ứng dụng phân tích dữ liệu...
                </p>
                <p>
                  Đây là quyển học liệu được thiết kế với mục tiêu dùng chung dành cho nhiều đối tượng người học bao gồm học viên kế toán cần hiểu biết về sự liên kết và vai trò hoạt động của các phòng ban để phối hợp làm việc.
                </p>
              </div>
            </div>
          )}
        </div>
      </IonContent>

      {/* Sticky Bottom Bar */}
      <div className="bottom-action-bar">
        <div className="action-icons-left">
          <div className="action-btn-item">
            <IonIcon icon={heart} className="text-red" />
            <span>540</span>
          </div>
          <div className="action-btn-item outline">
            <IonIcon icon={shareOutline} className="text-gray" />
          </div>
        </div>
        <button 
          className="btn-read-book"
          onClick={() => router.push(`/read-book/${book.id}`, 'forward')}
        >
          ĐỌC SÁCH
        </button>
      </div>
    </IonPage>
  );
};

export default BookDetail;
