import React, { useState } from 'react';
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
  chevronBackOutline, 
  locationOutline,
  chevronForwardOutline,
  calendarOutline,
  cardOutline,
  walletOutline
} from 'ionicons/icons';
import './ConfirmOrder.css';

const ConfirmOrder: React.FC = () => {
  const router = useIonRouter();
  
  // Modal states
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Selected values
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [deliveryDate, setDeliveryDate] = useState('Today 12 Jan');
  const [deliveryTime, setDeliveryTime] = useState('10PM - 11PM');

  return (
    <IonPage className="confirm-order-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="confirm-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="confirm-title">Confirm Order</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding-bottom">
        {/* Address Section */}
        <div className="section-title">Address</div>
        <div className="confirm-card" onClick={() => router.push('/location-map', 'forward')}>
          <div className="card-icon-left bg-purple-light">
            <IonIcon icon={locationOutline} className="text-purple" />
          </div>
          <div className="card-content">
            <h4>Utama Street No.20</h4>
            <p>Dumbo Street No.20, Dumbo, New York 10001, United States</p>
            <span className="change-btn">Change</span>
          </div>
          <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
        </div>

        {/* Summary Section */}
        <div className="section-title">Summary</div>
        <div className="summary-block">
          <div className="summary-row">
            <span>Price</span>
            <span>$87.13</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>$2</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total Payment</span>
            <span>$89.13</span>
          </div>
          <div className="see-details" onClick={() => setIsSummaryModalOpen(true)}>
            See details &gt;
          </div>
        </div>

        {/* Date and Time Section */}
        <div className="section-title">Date and time</div>
        <div className="confirm-card" onClick={() => setIsDateModalOpen(true)}>
          <div className="card-icon-left bg-purple">
            <IonIcon icon={calendarOutline} className="text-white" />
          </div>
          <div className="card-content">
            <h4>{deliveryDate}</h4>
            <p>{deliveryTime}</p>
          </div>
          <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
        </div>

        {/* Payment Section */}
        <div className="section-title">Payment</div>
        <div className="confirm-card" onClick={() => setIsPaymentModalOpen(true)}>
          <div className="card-icon-left bg-purple">
            <IonIcon icon={paymentMethod === 'Cash' ? walletOutline : cardOutline} className="text-white" />
          </div>
          <div className="card-content">
            <h4>Payment</h4>
            <p>{paymentMethod}</p>
          </div>
          <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
        </div>

        <div className="order-btn-container">
          <button className="primary-order-btn" onClick={() => router.push('/order-status', 'forward')}>Order</button>
        </div>

        {/* Summary Details Bottom Sheet */}
        <IonModal
          isOpen={isSummaryModalOpen}
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5]}
          onDidDismiss={() => setIsSummaryModalOpen(false)}
          className="bottom-sheet-modal"
        >
          <div className="modal-content">
            <div className="modal-drag-handle"></div>
            <h3 className="modal-title">Payment Details</h3>
            
            <div className="summary-row">
              <span className="summary-label">Price</span>
              <span className="summary-value">$87.13</span>
            </div>
            <div className="summary-sub-row">
              <span>Agatha Christie (x1)</span>
              <span>$29.99</span>
            </div>
            <div className="summary-sub-row">
              <span>Jason Schumann (x1)</span>
              <span>$29.99</span>
            </div>
            <div className="summary-sub-row">
              <span>Mark Manson (x1)</span>
              <span>$27.15</span>
            </div>

            <div className="summary-row" style={{ marginTop: '16px' }}>
              <span className="summary-label">Shipping</span>
              <span className="summary-value">$2</span>
            </div>

            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span className="summary-label">Total Payment</span>
              <span className="summary-value">$89.13</span>
            </div>
          </div>
        </IonModal>

        {/* Payment Methods Bottom Sheet */}
        <IonModal
          isOpen={isPaymentModalOpen}
          initialBreakpoint={0.4}
          breakpoints={[0, 0.4]}
          onDidDismiss={() => setIsPaymentModalOpen(false)}
          className="bottom-sheet-modal"
        >
          <div className="modal-content">
            <div className="modal-drag-handle"></div>
            <h3 className="modal-title">Your Payments</h3>
            
            <div className="payment-option-card" onClick={() => { setPaymentMethod('Cash'); setIsPaymentModalOpen(false); }}>
              <div className="card-icon-left bg-blue">
                <IonIcon icon={walletOutline} className="text-white" />
              </div>
              <div className="card-content">
                <h4>Cash</h4>
              </div>
              <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
            </div>

            <div className="payment-option-card" onClick={() => { setPaymentMethod('Credit Card'); setIsPaymentModalOpen(false); }}>
              <div className="card-icon-left bg-yellow">
                <IonIcon icon={cardOutline} className="text-white" />
              </div>
              <div className="card-content">
                <h4>Credit Card</h4>
              </div>
              <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
            </div>
          </div>
        </IonModal>

        {/* Date and Time Bottom Sheet */}
        <IonModal
          isOpen={isDateModalOpen}
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5]}
          onDidDismiss={() => setIsDateModalOpen(false)}
          className="bottom-sheet-modal"
        >
          <div className="modal-content">
            <div className="modal-drag-handle"></div>
            <h3 className="modal-title">Delivery date</h3>
            <div className="date-selector-row">
              <div className={`date-box ${deliveryDate === 'Today 12 Jan' ? 'active' : ''}`} onClick={() => setDeliveryDate('Today 12 Jan')}>
                <span className="date-label">Today</span>
                <span className="date-val">12 Jan</span>
              </div>
              <div className={`date-box ${deliveryDate === 'Tomorrow 13 Jan' ? 'active' : ''}`} onClick={() => setDeliveryDate('Tomorrow 13 Jan')}>
                <span className="date-label">Tomorrow</span>
                <span className="date-val">13 Jan</span>
              </div>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ConfirmOrder;
