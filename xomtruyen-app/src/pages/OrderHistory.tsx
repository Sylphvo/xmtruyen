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
import { chevronBackOutline } from 'ionicons/icons';
import './OrderHistory.css';
import { mockBooks } from '../data/mockData';

const OrderHistory: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="order-history-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="order-history-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="order-history-title">Order History</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="order-history-list">
          <h4 className="section-title">October 2021</h4>
          
          <div className="order-notification-card">
            <div className="order-book-cover">
              <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={mockBooks[1].image} alt="Book cover" />
            </div>
            <div className="order-notification-info">
              <h5>{mockBooks[1].title}</h5>
              <p>
                <span className="status-text green">Delivered</span>
                <span className="dot-separator">•</span>
                <span>1 items</span>
              </p>
            </div>
          </div>

          <div className="order-notification-card">
            <div className="order-book-cover">
              <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={mockBooks[2].image} alt="Book cover" />
            </div>
            <div className="order-notification-info">
              <h5>{mockBooks[2].title}</h5>
              <p>
                <span className="status-text green">Delivered</span>
                <span className="dot-separator">•</span>
                <span>5 items</span>
              </p>
            </div>
          </div>

          <div className="order-notification-card">
            <div className="order-book-cover">
              <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={mockBooks[0].image} alt="Book cover" />
            </div>
            <div className="order-notification-info">
              <h5>The Waiting</h5>
              <p>
                <span className="status-text red">Cancelled</span>
                <span className="dot-separator">•</span>
                <span>2 items</span>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderHistory;
