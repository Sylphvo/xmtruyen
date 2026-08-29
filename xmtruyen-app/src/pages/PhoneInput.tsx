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
import './PhoneInput.css';

const PhoneInput: React.FC = () => {
  const router = useIonRouter();
  const [phone, setPhone] = useState('');

  const handleContinue = () => {
    router.push('/verification-phone', 'forward');
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
          <h1 className="verification-title text-center">Phone Number</h1>
          <p className="verification-subtitle text-center">
            Please enter your phone number, so we can<br />
            more easily deliver your order
          </p>

          <div className="form-group phone-group">
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
                placeholder="123 456 7890"
                className="custom-input phone-input"
              />
            </div>
          </div>

          <IonButton 
            expand="block" 
            className={`auth-btn ${isFormValid ? 'active' : ''}`}
            onClick={handleContinue}
            disabled={!isFormValid}
            style={{ marginTop: '40px' }}
          >
            Continue
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PhoneInput;
