import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline, eyeOffOutline } from 'ionicons/icons';
import './MyAccount.css';

const MyAccount: React.FC = () => {
  const router = useIonRouter();
  const [name, setName] = useState('John');
  const [email, setEmail] = useState('johndoe@email.com');
  const [phone, setPhone] = useState('(+1) 234 567 890');
  const [password, setPassword] = useState('1234567');

  return (
    <IonPage className="my-account-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="my-account-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="my-account-title">My Account</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="account-avatar-section">
          <div className="account-avatar">
            <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
          </div>
          <button className="change-picture-btn">Change Picture</button>
        </div>

        <div className="account-form">
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              className="custom-input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="custom-input" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="phone-icon">📞</span>
              <input 
                type="text" 
                className="custom-input with-icon" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type="password" 
                className="custom-input" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <IonIcon icon={eyeOffOutline} className="eye-icon" />
            </div>
          </div>

          <button 
            className="save-changes-btn"
            onClick={() => router.goBack()}
          >
            Save Changes
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyAccount;
