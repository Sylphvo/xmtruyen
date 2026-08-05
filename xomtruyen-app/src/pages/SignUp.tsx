import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { eyeOffOutline, eyeOutline, chevronBackOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import './SignUp.css';

const SignUp: React.FC = () => {
  const router = useIonRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password validation logic
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  const isFormValid = name.length > 0 && email.length > 0 && hasMinLength && hasNumber && hasMixedCase;

  const handleRegister = () => {
    // Navigate to email verification step
    router.push('/verification-email', 'forward');
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
          <h1 className="auth-title">Sign Up</h1>
          <p className="auth-subtitle">Create account and choose favorite menu</p>

          <div className="form-group">
            <label className="input-label">Name</label>
            <div className="input-wrapper">
              <IonInput
                value={name}
                onIonInput={(e) => setName(e.detail.value!)}
                type="text"
                placeholder="Your name"
                className="custom-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <IonInput
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                type="email"
                placeholder="Your email"
                className="custom-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <IonInput
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                className="custom-input"
              />
              <IonButton fill="clear" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
              </IonButton>
            </div>
          </div>

          {/* Password Validation Rules */}
          {password.length > 0 && (
            <div className="password-rules">
              <div className={`rule ${hasMinLength ? 'valid' : 'invalid'}`}>
                <IonIcon icon={hasMinLength ? checkmarkOutline : closeOutline} />
                <span>Minimum 8 characters</span>
              </div>
              <div className={`rule ${hasNumber ? 'valid' : 'invalid'}`}>
                <IonIcon icon={hasNumber ? checkmarkOutline : closeOutline} />
                <span>Atleast 1 number (1-9)</span>
              </div>
              <div className={`rule ${hasMixedCase ? 'valid' : 'invalid'}`}>
                <IonIcon icon={hasMixedCase ? checkmarkOutline : closeOutline} />
                <span>Atleast lower case or uppercase letters</span>
              </div>
            </div>
          )}

          <IonButton 
            expand="block" 
            className={`auth-btn ${isFormValid ? 'active' : ''}`}
            onClick={handleRegister}
            disabled={!isFormValid}
            style={{ marginTop: '32px' }}
          >
            Register
          </IonButton>

          <div className="auth-footer-text">
            Have an account? <span className="highlight" onClick={() => router.push('/signin', 'forward')}>Sign In</span>
          </div>

          <div className="terms-text">
            By clicking Register, you agree to our<br />
            <span className="highlight">Terms, Data Policy.</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
