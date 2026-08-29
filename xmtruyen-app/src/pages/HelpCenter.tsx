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
import { chevronBackOutline, mailOutline, callOutline } from 'ionicons/icons';
import './HelpCenter.css';

const HelpCenter: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="help-center-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="help-center-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn-light" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="help-center-title">Help Center</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn-light" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="help-center-content">
        <div className="help-header-background">
          <div className="help-header-text">
            <h2>Help Center</h2>
            <p className="help-subtitle">Tell us how we can help 👋</p>
            <p className="help-desc">Chapter are standing by for service & support!</p>
          </div>
        </div>

        <div className="help-cards-container">
          <div className="help-card">
            <div className="help-icon-wrapper">
              <IonIcon icon={mailOutline} />
            </div>
            <h4>Email</h4>
            <p>Send to your email</p>
          </div>

          <div className="help-card">
            <div className="help-icon-wrapper">
              <IonIcon icon={callOutline} />
            </div>
            <h4>Phone Number</h4>
            <p>Send to your phone</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HelpCenter;
