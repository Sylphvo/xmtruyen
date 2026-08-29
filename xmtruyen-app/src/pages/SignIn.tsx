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
import SocialLogin from '../components/SocialLogin';
import './SignIn.css';

const SignIn: React.FC = () => {
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Navigate to Home or somewhere on successful login
    router.push('/home', 'forward', 'replace');
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <IonPage className="auth-page">
      <IonContent fullscreen scrollY={true}>
        <div className="auth-header">
          <IonButton fill="clear" className="back-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </div>
        
        <div className="auth-container">
          <h1 className="auth-title">
            Welcome Back <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="auth-subtitle">Sign to your account</p>

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

          <div className="forgot-password">
            <span onClick={() => router.push('/forgot-password', 'forward')}>Forgot Password?</span>
          </div>

          <IonButton 
            expand="block" 
            className={`auth-btn ${isFormValid ? 'active' : ''}`}
            onClick={handleLogin}
            disabled={!isFormValid}
          >
            Login
          </IonButton>

          <div className="auth-footer-text">
            Don't have an account? <span className="highlight" onClick={() => router.push('/signup', 'forward')}>Sign Up</span>
          </div>

          <SocialLogin />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
