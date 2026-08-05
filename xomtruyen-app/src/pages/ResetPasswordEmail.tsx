import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import './ResetPassword.css';

const ResetPasswordEmail: React.FC = () => {
  const router = useIonRouter();
  const [email, setEmail] = useState('');

  const handleSend = () => {
    // Pass the email or store it to context/state, here we just navigate
    router.push('/reset-verify-email', 'forward');
  };

  const isFormValid = email.length > 0 && email.includes('@');

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
            Please enter your email, we will send verification code to your email.
          </p>

          <div className="form-group reset-form-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <IonInput
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                type="email"
                placeholder="example@email.com"
                className="custom-input"
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

export default ResetPasswordEmail;
