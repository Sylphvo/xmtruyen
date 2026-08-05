import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import CustomKeypad from '../components/CustomKeypad';
import OtpInput from '../components/OtpInput';
import './Verification.css';

const ResetVerifyPhone: React.FC = () => {
  const router = useIonRouter();
  const [code, setCode] = useState('');
  const maxLength = 4;

  const handleKeyPress = (key: string) => {
    if (code.length < maxLength) {
      setCode((prev) => prev + key);
    }
  };

  const handleDelete = () => {
    if (code.length > 0) {
      setCode((prev) => prev.slice(0, -1));
    }
  };

  const handleContinue = () => {
    router.push('/new-password', 'forward');
  };

  const isFormValid = code.length === maxLength;

  return (
    <IonPage className="verification-page">
      <IonContent fullscreen scrollY={true} className="ion-padding-bottom">
        <div className="auth-header">
          <IonButton fill="clear" className="back-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </div>
        
        <div className="auth-container text-center">
          <h1 className="verification-title">Verification Code</h1>
          <p className="verification-subtitle">
            Please enter the code we just sent to phone<br />
            number <strong>(+91) 123 435 7565</strong>
          </p>

          <OtpInput value={code} length={maxLength} />

          <p className="resend-text">
            If you didn't receive a code? <strong>Resend</strong>
          </p>

          <IonButton 
            expand="block" 
            className={`auth-btn ${isFormValid ? 'active' : ''}`}
            onClick={handleContinue}
            disabled={!isFormValid}
          >
            Continue
          </IonButton>
        </div>

        <CustomKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
      </IonContent>
    </IonPage>
  );
};

export default ResetVerifyPhone;
