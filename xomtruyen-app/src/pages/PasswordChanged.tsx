import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import './PasswordChanged.css';

const PasswordChanged: React.FC = () => {
  const router = useIonRouter();

  const handleLogin = () => {
    router.push('/signin', 'forward', 'replace');
  };

  return (
    <IonPage className="password-changed-page">
      <IonContent fullscreen scrollY={true}>
        <div className="password-changed-container">
          <div className="password-changed-illustration">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="40" width="50" height="40" rx="5" fill="#513b86" />
              <path d="M20 40 H80" stroke="white" strokeWidth="2" />
              <circle cx="50" cy="50" r="5" fill="#fbc02d" />
              <path d="M50 20 L50 10 M30 30 L20 20 M70 30 L80 20" stroke="#fbc02d" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="password-changed-title">Password Changed!</h1>
          <p className="password-changed-subtitle">
            Password changed successfully, you can login again with a new password
          </p>

          <IonButton 
            expand="block" 
            className="auth-btn active password-changed-btn"
            onClick={handleLogin}
          >
            Login
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PasswordChanged;
