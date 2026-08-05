import React from 'react';
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
import { chevronBackOutline, heart } from 'ionicons/icons';
import './Favorites.css';
import { mockBooks } from '../data/mockData';

const Favorites: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="favorites-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="favorites-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="favorites-title">Your Favorites</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="favorites-list">
          {mockBooks.slice(0, 4).map((book, index) => (
            <div key={index} className="favorite-item-card">
              <div className="favorite-book-cover">
                <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={book.image} alt={book.title} />
              </div>
              <div className="favorite-book-info">
                <h5>{book.title}</h5>
                <p className="favorite-price">${book.price}</p>
              </div>
              <IonIcon icon={heart} className="favorite-heart-icon" />
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Favorites;
