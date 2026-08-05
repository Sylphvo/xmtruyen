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
import { searchOutline, notificationsOutline } from 'ionicons/icons';
import { mockBooks } from '../data/mockData';
import BookCard from '../components/BookCard';
import './Category.css';

const tabs = ['All', 'Novels', 'Self Love', 'Science', 'Romantic'];

const Category: React.FC = () => {
  const router = useIonRouter();
  const [activeTab, setActiveTab] = useState('All');

  return (
    <IonPage className="category-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="category-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.push('/search', 'forward')}>
            <IonIcon icon={searchOutline} />
          </IonButton>
          <IonTitle className="category-title">Category</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn relative-icon" onClick={() => router.push('/notifications', 'forward')}>
            <IonIcon icon={notificationsOutline} />
            <div className="notification-dot"></div>
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="category-tabs hide-scrollbar">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`category-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="category-grid">
          {/* Duplicate mock data to show a scrolling list */}
          {[...mockBooks, ...mockBooks, ...mockBooks].map((book, index) => (
            <div key={`${book.id}-${index}`} className="category-grid-item">
              <BookCard {...book} />
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Category;
