import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import './Notifications.css';
import { mockBooks } from '../data/mockData';

const Notifications: React.FC = () => {
  const router = useIonRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'news'>('orders');

  return (
    <IonPage className="notifications-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="notifications-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="notifications-title">Notification</IonTitle>
          {/* Empty slot to balance the title */}
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
        <div className="notifications-segment-container">
          <IonSegment 
            value={activeTab} 
            onIonChange={e => setActiveTab(e.detail.value as 'orders' | 'news')}
            className="notifications-segment"
          >
            <IonSegmentButton value="orders">
              <IonLabel>Orders</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="news">
              <IonLabel>News</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {activeTab === 'orders' ? (
          <div className="orders-tab">
            <h4 className="section-title">Current</h4>
            <div className="order-notification-card">
              <div className="order-book-cover">
                <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={mockBooks[0].image} alt="Book cover" />
              </div>
              <div className="order-notification-info">
                <h5>{mockBooks[0].title}</h5>
                <p>
                  <span className="status-text blue">On the way</span>
                  <span className="dot-separator">•</span>
                  <span>1 items</span>
                </p>
              </div>
            </div>

            <h4 className="section-title mt-24">October 2021</h4>
            
            <div className="order-notification-card">
              <div className="order-book-cover">
                <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={mockBooks[1].image} alt="Book cover" />
              </div>
              <div className="order-notification-info">
                <h5>{mockBooks[1].title}</h5>
                <p>
                  <span className="status-text green">Delivered</span>
                  <span className="dot-separator">•</span>
                  <span>1 items</span>
                </p>
              </div>
            </div>

            <div className="order-notification-card">
              <div className="order-book-cover">
                <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={mockBooks[2].image} alt="Book cover" />
              </div>
              <div className="order-notification-info">
                <h5>{mockBooks[2].title}</h5>
                <p>
                  <span className="status-text green">Delivered</span>
                  <span className="dot-separator">•</span>
                  <span>3 items</span>
                </p>
              </div>
            </div>

            <div className="order-notification-card">
              <div className="order-book-cover">
                <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={mockBooks[0].image} alt="Book cover" />
              </div>
              <div className="order-notification-info">
                <h5>The Waiting</h5>
                <p>
                  <span className="status-text red">Cancelled</span>
                  <span className="dot-separator">•</span>
                  <span>2 items</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="news-tab">
            <h4 className="section-title">October 2021</h4>
            
            <div className="news-item" onClick={() => router.push('/promotion-detail', 'forward')}>
              <div className="news-header-row">
                <span className="news-type promotion">Promotion</span>
                <span className="news-time">Oct 24 • 08.00</span>
              </div>
              <p className="news-text">Today <strong>50% discount</strong> on all Books in Novel category with online orders worldwide.</p>
            </div>
            
            <div className="news-item" onClick={() => router.push('/promotion-detail', 'forward')}>
              <div className="news-header-row">
                <span className="news-type promotion">Promotion</span>
                <span className="news-time">Oct 20 • 20.30</span>
              </div>
              <p className="news-text"><strong>Buy 2 get 1 free</strong> for since books from 20 - 10 October 2021.</p>
            </div>

            <h4 className="section-title mt-24">September 2021</h4>
            
            <div className="news-item">
              <div className="news-header-row">
                <span className="news-type information">Information</span>
                <span className="news-time">Sept 16 • 11.44</span>
              </div>
              <p className="news-text">There is a new book now are available</p>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
