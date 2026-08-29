import React from 'react';
import {
  IonPage,
  IonContent,
  useIonRouter,
} from '@ionic/react';
import './OrderStatus.css';

const OrderStatus: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="order-status-page">
      <IonContent fullscreen className="order-status-content">
        <div className="receipt-container">
          <div className="receipt-header">
            <h3>Thank you 👏</h3>
            <h2>Lorem ipsum dolor sit</h2>
            <p>Order #2930941</p>
          </div>

          <div className="cancel-order-text">
            Do you want to cancel your order? <span className="cancel-link">Cancel</span>
          </div>

          <div className="receipt-details">
            <h4 className="details-title">Order Details</h4>
            
            <div className="receipt-item-row">
              <span className="item-name">1x Carrie Fisher</span>
              <span className="item-price">$29.99</span>
            </div>
            <div className="receipt-item-row">
              <span className="item-name">1x The Da vinci Code</span>
              <span className="item-price">$29.99</span>
            </div>
            <div className="receipt-item-row">
              <span className="item-name">1x Arcu ipsum feugiat leo info</span>
              <span className="item-price">$27.12</span>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">$87.10</span>
            </div>
            
            <div className="receipt-divider"></div>

            <div className="receipt-summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">$2</span>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-total-row">
              <span className="total-label">Total Payment</span>
              <span className="total-value text-purple">$89.10</span>
            </div>

            <div className="receipt-delivery-info">
              <div className="delivery-row">
                <span className="delivery-label">Delivery in</span>
                <span className="delivery-value">10 - 15 mins</span>
              </div>
              <div className="delivery-row">
                <span className="delivery-label">Time</span>
                <span className="delivery-value">15:24 - 15:39</span>
              </div>
            </div>
          </div>
          
          <button 
            className="order-status-btn" 
            onClick={() => router.push('/order-received', 'forward')}
          >
            Order Status
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderStatus;
