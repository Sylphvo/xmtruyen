import React from 'react';
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
import { cartOutline, searchOutline } from 'ionicons/icons';
import './Cart.css';

const Cart: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="cart-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="cart-toolbar">
          <IonTitle className="cart-title">My Cart</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" onClick={() => router.push('/search', 'forward')}>
            <IonIcon icon={searchOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="empty-cart-container">
          <div className="empty-cart-icon-wrapper">
            <IonIcon icon={cartOutline} />
          </div>
          <p className="empty-cart-text">There is no products</p>
          
          {/* Temporary button for testing the Confirm Order flow */}
          <IonButton 
            className="demo-checkout-btn" 
            fill="clear"
            onClick={() => router.push('/confirm-order', 'forward')}
          >
            Go to Checkout (Demo)
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Cart;
