import React, { useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonModal,
  useIonRouter,
} from '@ionic/react';
import { 
  personOutline, 
  locationOutline, 
  pricetagOutline, 
  heartOutline, 
  documentTextOutline, 
  helpCircleOutline,
  chevronForwardOutline,
  closeOutline
} from 'ionicons/icons';
import './Profile.css';

const Profile: React.FC = () => {
  const router = useIonRouter();
  const logoutModal = useRef<HTMLIonModalElement>(null);

  const menuItems = [
    { icon: personOutline, label: 'My Account', path: '/my-account' },
    { icon: locationOutline, label: 'Address', path: '/location-map' },
    { icon: pricetagOutline, label: 'Offers & Promos', path: '/offers' },
    { icon: heartOutline, label: 'Your Favorites', path: '/favorites' },
    { icon: documentTextOutline, label: 'Order History', path: '/order-history' },
    { icon: helpCircleOutline, label: 'Help Center', path: '/help-center' },
  ];

  return (
    <IonPage className="profile-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="profile-toolbar">
          <IonTitle className="profile-title">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="profile-user-card">
          <div className="profile-avatar">
            <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
          </div>
          <div className="profile-info">
            <h2>John Doe</h2>
            <p>(+1) 234 567 890</p>
          </div>
          <IonButton 
            fill="clear" 
            className="logout-btn-small"
            id="open-logout-modal"
          >
            Logout
          </IonButton>
        </div>

        <div className="profile-menu-list">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="profile-menu-item"
              onClick={() => router.push(item.path, 'forward')}
            >
              <div className="menu-item-left">
                <IonIcon icon={item.icon} className="menu-icon" />
                <span className="menu-label">{item.label}</span>
              </div>
              <IonIcon icon={chevronForwardOutline} className="menu-chevron" />
            </div>
          ))}
        </div>

        <IonModal 
          ref={logoutModal} 
          trigger="open-logout-modal" 
          initialBreakpoint={0.4} 
          breakpoints={[0, 0.4]}
          className="bottom-sheet-modal"
        >
          <div className="logout-modal-content">
            <h2 className="logout-modal-title">Logout</h2>
            <p className="logout-modal-text">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <button 
              className="primary-logout-btn"
              onClick={() => {
                logoutModal.current?.dismiss();
                setTimeout(() => router.push('/sign-in', 'root'), 300);
              }}
            >
              Logout
            </button>
            <button 
              className="cancel-logout-btn"
              onClick={() => logoutModal.current?.dismiss()}
            >
              Cancel
            </button>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
