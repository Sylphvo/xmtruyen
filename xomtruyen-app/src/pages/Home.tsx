import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { 
  notificationsOutline, 
  chevronForwardOutline,
  documentTextOutline,
  timeOutline,
  star
} from 'ionicons/icons';
import './Home.css';

const Home: React.FC = () => {
  const router = useIonRouter();

  // Mock data tailored for the new UI
  const verticalBooks = [
    {
      id: 1,
      title: 'Làm thế nào để trở thành siêu sao tiếp thị',
      author: 'Jeffrey J. Fox',
      rating: 4.5,
      pages: 25,
      quiz: 2,
      image: 'https://m.media-amazon.com/images/I/71UypkUjStL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      id: 2,
      title: 'Ánh hoàng hôn mỏng manh',
      author: 'Tình Không, Lam Hề',
      rating: 4.5,
      pages: 25,
      quiz: 2,
      image: 'https://sachbaovn.vn/Content/Images/Books/anh-hoang-hon-mong-manh-tap-1.jpg'
    },
    {
      id: 3,
      title: 'Cô dâu hoàn mỹ',
      author: 'Jeffrey J. Fox',
      rating: 4.5,
      pages: 25,
      quiz: 2,
      image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1360155609i/17302482.jpg'
    },
    {
      id: 4,
      title: 'Người giàu tiếp theo sẽ là bạn',
      author: 'Tình Không, Lam Hề',
      rating: 4.5,
      pages: 25,
      quiz: 2,
      image: 'https://salt.tikicdn.com/cache/w1200/ts/product/5e/0a/61/54d924dbfb9e7e8b615b3c3757a3e7a0.jpg'
    }
  ];

  const horizontalBooks1 = [
    {
      id: 5,
      title: 'Phá bỏ nguyên tắc để bứt phá',
      author: 'Reed Hastings, Erin Meyer',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80'
    },
    {
      id: 6,
      title: 'Phá bỏ nguyên tắc để bứt phá',
      author: 'Reed Hastings, Erin Meyer',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80'
    },
    {
      id: 7,
      title: 'Phá bỏ nguyên tắc để bứt phá',
      author: 'Reed Hastings, Erin Meyer',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1629196914539-775b8bece2b4?w=400&q=80'
    }
  ];

  const horizontalBooks2 = [
    {
      id: 8,
      title: 'Phá bỏ nguyên tắc để bứt phá',
      author: 'Reed Hastings, Erin Meyer',
      rating: 5.0,
      image: 'https://salt.tikicdn.com/cache/w1200/ts/product/2e/22/01/5e7fb0f46d1ec216259ce34b9cf47225.jpg'
    },
    {
      id: 9,
      title: 'Phá bỏ nguyên tắc để bứt phá',
      author: 'Reed Hastings, Erin Meyer',
      rating: 4.5,
      image: 'https://salt.tikicdn.com/cache/w1200/ts/product/6e/b0/27/efb8b209bd3bf7913364f9bfcdb3ecb5.jpg'
    },
    {
      id: 10,
      title: 'Phá bỏ nguyên tắc để bứt phá',
      author: 'Reed Hastings, Erin Meyer',
      rating: 4.2,
      image: 'https://salt.tikicdn.com/cache/w1200/ts/product/72/72/72/72b83eb1f0744c8c7c724736173d1f3b.jpg'
    }
  ];

  return (
    <IonPage className="new-home-page">
      <IonHeader className="ion-no-border">
        <div className="red-header-container">
          <div className="red-header-top">
            <div className="user-greeting">
              <h1>Xin chào, txbinh</h1>
              <p>Cùng nhau học tập bạn nhé</p>
            </div>
            <div className="header-icons">
              <div className="bell-container" onClick={() => router.push('/notifications', 'forward')}>
                <IonIcon icon={notificationsOutline} />
              </div>
              <div className="avatar-container">
                <img src="https://ui-avatars.com/api/?name=txbinh&background=random" alt="Avatar" />
              </div>
            </div>
          </div>
        </div>
      </IonHeader>

      <IonContent fullscreen className="new-home-content">
        <div className="red-bg-extension"></div>
        
        {/* Progress Card */}
        <div className="progress-card-wrapper">
          <div className="progress-card">
            <div className="progress-header">
              <span className="progress-title">Sách được giao</span>
              <span className="progress-link">Xem chi tiết</span>
            </div>
            <div className="progress-stats">
              <span className="progress-bold">8 sách</span>
              <span className="progress-light">/ Bạn đã hoàn thành 5 sách</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '62.5%' }}></div>
            </div>
          </div>
        </div>

        {/* Section: YourCompany */}
        <div className="home-section">
          <div className="section-title-row">
            <h2>Tủ sách YourCompany</h2>
            <IonIcon icon={chevronForwardOutline} />
          </div>
          <div className="vertical-book-list">
            {verticalBooks.map((book) => (
              <div className="v-book-card" key={book.id} onClick={() => router.push(`/book-detail/${book.id}`, 'forward')}>
                <div className="v-book-cover">
                  <img src={book.image} alt={book.title} />
                </div>
                <div className="v-book-info">
                  <h3 className="v-book-title">{book.title}</h3>
                  <p className="v-book-author">{book.author}</p>
                  
                  <div className="v-book-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <IonIcon key={s} icon={star} className="star-icon" />
                    ))}
                    <span className="star-rating">{book.rating}</span>
                  </div>
                  
                  <div className="v-book-meta">
                    <div className="meta-item">
                      <IonIcon icon={documentTextOutline} />
                      <span>{book.pages} trang</span>
                    </div>
                    <div className="meta-divider">|</div>
                    <div className="meta-item">
                      <IonIcon icon={timeOutline} />
                      <span>{book.quiz} Câu Quiz</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Lạc Việt */}
        <div className="home-section">
          <div className="section-title-row">
            <h2>Tủ sách Lạc Việt</h2>
            <IonIcon icon={chevronForwardOutline} />
          </div>
          <div className="horizontal-book-list hide-scrollbar">
            {horizontalBooks1.map((book) => (
              <div className="h-book-card" key={book.id} onClick={() => router.push(`/book-detail/${book.id}`, 'forward')}>
                <div className="h-book-cover-container">
                  <img src={book.image} alt={book.title} className="h-book-cover" />
                  <div className="rating-pill">
                    <IonIcon icon={star} />
                    <span>{book.rating.toFixed(1)}</span>
                  </div>
                </div>
                <h3 className="h-book-title">{book.title}</h3>
                <p className="h-book-author">{book.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Sách mới */}
        <div className="home-section">
          <div className="section-title-row">
            <h2>Sách mới nổi bật</h2>
            <IonIcon icon={chevronForwardOutline} />
          </div>
          <div className="horizontal-book-list hide-scrollbar">
            {horizontalBooks2.map((book) => (
              <div className="h-book-card" key={book.id} onClick={() => router.push(`/book-detail/${book.id}`, 'forward')}>
                <div className="h-book-cover-container">
                  <img src={book.image} alt={book.title} className="h-book-cover" />
                  <div className="rating-pill">
                    <IonIcon icon={star} />
                    <span>{book.rating.toFixed(1)}</span>
                  </div>
                </div>
                <h3 className="h-book-title">{book.title}</h3>
                <p className="h-book-author">{book.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="promo-banner-container">
          <div className="promo-banner">
            <h3>Khám phá kho tàng tri thức sách</h3>
            <p>Đăng ký ngay để nhận được sách mới nhất</p>
            <button className="promo-btn">ĐĂNG KÝ NGAY</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
