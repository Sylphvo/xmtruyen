import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { eyeOffOutline, eyeOutline, chevronBackOutline } from 'ionicons/icons';
import './NewPassword.css';

const NewPassword: React.FC = () => {
  const router = useIonRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSend = () => {
    router.push('/password-changed', 'forward');
  };

  const isFormValid = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  return (
    <IonPage className="auth-page">
      <IonContent fullscreen scrollY={true}>
        <div className="auth-header">
          <IonButton fill="clear" className="back-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </div>
        
        <div className="auth-container">
          <h1 className="auth-title">New Password</h1>
          <p className="auth-subtitle">
            Create your new password, so you can login to your account.
          </p>

          <div className="form-group">
            <label className="input-label">New Password</label>
            <div className="input-wrapper">
              <IonInput
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                className="custom-input new-password-input"
              />
              <IonButton fill="clear" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
              </IonButton>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Confirm Password</label>
            <div className="input-wrapper">
              <IonInput
                value={confirmPassword}
                onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Your password"
                className="custom-input new-password-input"
              />
              <IonButton fill="clear" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <IonIcon icon={showConfirmPassword ? eyeOutline : eyeOffOutline} />
              </IonButton>
            </div>
          </div>

          <IonButton 
            expand="block" 
            className={`auth-btn ${isFormValid ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!isFormValid}
            style={{ marginTop: '40px' }}
          >
            Send
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NewPassword;
