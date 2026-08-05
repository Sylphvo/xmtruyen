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
import './Offers.css';

const Offers: React.FC = () => {
  const router = useIonRouter();

  const offers = [
    { discount: '50% OFF', color: '#513b86' }, // Purple
    { discount: '23% OFF', color: '#ffca28' }, // Yellow
    { discount: '50% OFF', color: '#4a90e2' }, // Blue
    { discount: '23% OFF', color: '#ff7043' }, // Orange
    { discount: '50% OFF', color: '#1a1a1a' }, // Black
    { discount: '23% OFF', color: '#2ecc71' }, // Green
  ];

  return (
    <IonPage className="offers-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="offers-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="offers-title">Offers</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <h3 className="offers-subtitle">You Have {offers.length} Copons to use</h3>
        
        <div className="offers-grid">
          {offers.map((offer, index) => (
            <div 
              key={index} 
              className="offer-card" 
              style={{ backgroundColor: offer.color }}
            >
              <div className="offer-discount">{offer.discount}</div>
              <button className="offer-copy-btn">Copy</button>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Offers;
