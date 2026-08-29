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
import { chevronBackOutline, locateOutline, locationOutline } from 'ionicons/icons';
import './LocationMap.css';

const LocationMap: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="location-map-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="location-map-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="location-map-title">Location</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="map-container">
          <div className="map-placeholder">
            {/* Fake map image background in css */}
            <div className="map-marker-pin">
              <IonIcon icon={locationOutline} />
            </div>
          </div>
          <div className="current-location-btn">
            <IonIcon icon={locateOutline} />
          </div>
        </div>

        <div className="bottom-sheet-overlay">
          <div className="modal-drag-handle"></div>
          <h3 className="modal-title">Detail Address</h3>
          
          <div className="address-detail-card" onClick={() => router.push('/location-form', 'forward')}>
            <div className="card-icon-left bg-purple-light">
              <IonIcon icon={locationOutline} className="text-purple" />
            </div>
            <div className="card-content">
              <h4>Utama Street No.20</h4>
              <p>Dumbo Street No.20, Dumbo, New York 10001, United States of America</p>
            </div>
          </div>

          <h4 className="save-address-title">Save Address As</h4>
          <div className="save-address-options">
            <div className="address-tag active">Home</div>
            <div className="address-tag">Office</div>
          </div>

          <button className="primary-order-btn mt-24" onClick={() => router.goBack()}>Confirmation</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LocationMap;
