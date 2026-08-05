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
import './PromotionDetail.css';
import { mockBooks } from '../data/mockData';

const PromotionDetail: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="promotion-detail-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="promotion-detail-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="promotion-detail-title">Promotion</IonTitle>
          {/* Empty slot to balance the title */}
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="promotion-banner">
          <div className="promotion-banner-content">
            <h3 className="promotion-banner-title">50% Discount<br/>On All Desert</h3>
            <p className="promotion-banner-subtitle">Grab it now!</p>
            <button className="promotion-banner-btn">Order Now</button>
          </div>
          <div className="promotion-banner-image">
            <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={mockBooks[0].image} alt="Promotion" />
          </div>
        </div>

        <h2 className="promotion-article-title">Today 50% discount on all products in Chapter with online orders</h2>
        
        <div className="promotion-article-body">
          <p>Excuse me... Who could ever resist a discount here? 👀</p>
          <p>Hear me out. Today, October 21, 2021, Chapter has a 50% discount for any product. What are you waiting for, let's order now before it runs out.</p>
          <p>All of the products are discounted, just order through the Chapter app to enjoy this discount. From the best to the best we have prepared for you, may you always be happy when ordering at Chapter. Please choose the best product you want.</p>
          <p>So, what's your call? Let's roll, order your comfort food now 🥳</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PromotionDetail;
