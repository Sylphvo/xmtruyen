import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline, mailOutline, callOutline } from 'ionicons/icons';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const router = useIonRouter();
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'phone' | null>(null);

  const handleContinue = () => {
    if (selectedMethod === 'email') {
      router.push('/reset-email', 'forward');
    } else if (selectedMethod === 'phone') {
      router.push('/reset-phone', 'forward');
    }
  };

  return (
    <IonPage className="auth-page">
      <IonContent fullscreen scrollY={true}>
        <div className="auth-header">
          <IonButton fill="clear" className="back-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </div>
        
        <div className="auth-container">
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">
            Select which contact details should we use to reset your password
          </p>

          <div className="contact-methods">
            <div 
              className={`method-card ${selectedMethod === 'email' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('email')}
            >
              <div className="icon-circle">
                <IonIcon icon={mailOutline} />
              </div>
              <div className="method-info">
                <h3>Email</h3>
                <p>Send to your email</p>
              </div>
            </div>

            <div 
              className={`method-card ${selectedMethod === 'phone' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('phone')}
            >
              <div className="icon-circle">
                <IonIcon icon={callOutline} />
              </div>
              <div className="method-info">
                <h3>Phone Number</h3>
                <p>Send to your phone</p>
              </div>
            </div>
          </div>

          <IonButton 
            expand="block" 
            className={`auth-btn ${selectedMethod ? 'active' : ''}`}
            onClick={handleContinue}
            disabled={!selectedMethod}
            style={{ marginTop: 'auto', marginBottom: '40px' }}
          >
            Continue
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
