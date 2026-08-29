import React, { useMemo } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline, searchOutline, star } from 'ionicons/icons';
import { useParams } from 'react-router';
import { mockAuthors, mockBooks } from '../data/mockData';
import BookCard from '../components/BookCard';
import './AuthorDetail.css';

const AuthorDetail: React.FC = () => {
  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();
  
  const author = useMemo(() => {
    return mockAuthors.find(a => a.id === Number(id)) || mockAuthors[0];
  }, [id]);

  return (
    <IonPage className="author-detail-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="author-detail-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="author-detail-title">Authors</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn">
            <IonIcon icon={searchOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="author-profile-section">
          <div className="author-large-avatar">
            <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={author.image} alt={author.name} />
          </div>
          <h2>{author.name}</h2>
          <p className="author-role-label">{author.role}</p>
          <div className="author-rating">
            {[...Array(5)].map((_, i) => (
              <IonIcon key={i} icon={star} className={i < Math.floor(author.rating) ? 'star-filled' : 'star-empty'} />
            ))}
            <span className="rating-value">({author.rating.toFixed(1)})</span>
          </div>
        </div>

        <div className="author-about-section">
          <h3>About</h3>
          <p>{author.description}</p>
        </div>

        <div className="author-products-section">
          <h3>Products</h3>
          <div className="products-grid">
            {/* Repeating books for demonstration */}
            {[...mockBooks, ...mockBooks].slice(0, 4).map((book, index) => (
              <BookCard key={`${book.id}-${index}`} {...book} />
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthorDetail;
