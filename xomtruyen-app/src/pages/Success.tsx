import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import './Success.css';

const Success: React.FC = () => {
  const router = useIonRouter();

  const handleGetStarted = () => {
    router.push('/home', 'forward', 'replace');
  };

  return (
    <IonPage className="success-page">
      <IonContent fullscreen scrollY={true}>
        <div className="success-container">
          <div className="success-illustration">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simple generic box with star bursts */}
              <rect x="25" y="40" width="50" height="40" rx="5" fill="#513b86" />
              <path d="M20 40 H80" stroke="white" strokeWidth="2" />
              <circle cx="50" cy="50" r="5" fill="#fbc02d" />
              <path d="M50 20 L50 10 M30 30 L20 20 M70 30 L80 20" stroke="#fbc02d" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="success-title">Congratulation!</h1>
          <p className="success-subtitle">
            your account is complete, please enjoy the<br />
            best menu from us.
          </p>

          <IonButton 
            expand="block" 
            className="auth-btn active success-btn"
            onClick={handleGetStarted}
          >
            Get Started
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Success;
