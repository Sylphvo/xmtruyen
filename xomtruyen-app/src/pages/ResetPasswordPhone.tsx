import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline, callOutline } from 'ionicons/icons';
import './ResetPassword.css';

const ResetPasswordPhone: React.FC = () => {
  const router = useIonRouter();
  const [phone, setPhone] = useState('');

  const handleSend = () => {
    router.push('/reset-verify-phone', 'forward');
  };

  const isFormValid = phone.length >= 9;

  return (
    <IonPage className="auth-page">
      <IonContent fullscreen scrollY={true}>
        <div className="auth-header">
          <IonButton fill="clear" className="back-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </div>
        
        <div className="auth-container">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            Please enter your phone number, we will send a verification code to your phone number.
          </p>

          <div className="form-group reset-form-group">
            <label className="input-label">Phone Number</label>
            <div className="input-wrapper phone-wrapper">
              <div className="country-code">
                <IonIcon icon={callOutline} className="phone-icon" />
                <span>(+91)</span>
              </div>
              <IonInput
                value={phone}
                onIonInput={(e) => setPhone(e.detail.value!)}
                type="tel"
                placeholder="123 435 7565"
                className="custom-input phone-input"
              />
            </div>
          </div>

          <IonButton 
            expand="block" 
            className={`auth-btn ${isFormValid ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!isFormValid}
          >
            Send
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPasswordPhone;
