import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { logoGoogle, logoApple } from 'ionicons/icons';
import './SocialLogin.css';

const SocialLogin: React.FC = () => {
  return (
    <div className="social-login-container">
      <div className="divider">
        <span>Or with</span>
      </div>
      <div className="social-buttons">
        <IonButton fill="outline" className="social-btn" expand="block">
          <IonIcon slot="start" icon={logoGoogle} style={{ color: '#DB4437' }} />
          Sign in with Google
        </IonButton>
        <IonButton fill="outline" className="social-btn" expand="block">
          <IonIcon slot="start" icon={logoApple} style={{ color: '#000000' }} />
          Sign in with Apple
        </IonButton>
      </div>
    </div>
  );
};

export default SocialLogin;
