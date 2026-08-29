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
import { chevronBackOutline, searchOutline } from 'ionicons/icons';
import { mockAuthors } from '../data/mockData';
import './AuthorsList.css';

const tabs = ['All', 'Poets', 'Playwrights', 'Novelists', 'Journalists'];

const AuthorsList: React.FC = () => {
  const router = useIonRouter();
  const [activeTab, setActiveTab] = useState('All');

  return (
    <IonPage className="authors-list-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="authors-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="authors-title">Authors</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn">
            <IonIcon icon={searchOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="check-authors-header">
          <p>Check the authors</p>
          <h2>Authors</h2>
        </div>

        <div className="vendors-tabs hide-scrollbar">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`vendor-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="authors-vertical-list">
          {mockAuthors.map((author) => (
            <div 
              key={author.id} 
              className="author-list-item"
              onClick={() => router.push(`/author-detail/${author.id}`, 'forward')}
            >
              <div className="author-list-avatar">
                <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={author.image} alt={author.name} />
              </div>
              <div className="author-list-info">
                <h3>{author.name}</h3>
                <p>{author.description}</p>
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthorsList;
