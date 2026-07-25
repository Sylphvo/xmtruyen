import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { star, giftOutline, sparklesOutline } from 'ionicons/icons';
import './OrderReceived.css';

const OrderReceived: React.FC = () => {
  const router = useIonRouter();
  const [rating, setRating] = useState(0);

  return (
    <IonPage className="order-received-page">
      <IonContent fullscreen className="order-received-content">
        <div className="received-container">
          <div className="gift-illustration">
            <IonIcon icon={sparklesOutline} className="sparkles-icon" />
            <div className="gift-box">
              <IonIcon icon={giftOutline} />
            </div>
            <IonIcon icon={sparklesOutline} className="sparkles-icon right" />
          </div>

          <h2 className="received-title">You Received The Order!</h2>
          <p className="received-order-id">Order #2930941</p>

          <div className="feedback-card">
            <h3>Tell us your feedback 👏</h3>
            <p>Lorem ipsum dolor sit amet consectetur. Dignissim magna vitae.</p>
            
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <IonIcon 
                  key={starIndex}
                  icon={star}
                  className={`star-icon ${rating >= starIndex ? 'active' : ''}`}
                  onClick={() => setRating(starIndex)}
                />
              ))}
            </div>

            <div className="feedback-input-wrapper">
              <input type="text" placeholder="Write something for us!" className="feedback-input" />
            </div>

            <button 
              className="done-btn" 
              onClick={() => router.push('/tabs/home', 'forward')}
            >
              Done
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderReceived;
