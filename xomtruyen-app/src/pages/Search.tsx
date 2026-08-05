import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonInput,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline, searchOutline } from 'ionicons/icons';
import './Search.css';

const recentSearchesData = [
  'The Good Sister',
  'Carries Fisher'
];

const Search: React.FC = () => {
  const router = useIonRouter();
  const [searchText, setSearchText] = useState('');

  return (
    <IonPage className="search-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="search-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="search-title">Search</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={searchOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="search-input-container">
          <IonIcon icon={searchOutline} className="search-input-icon" />
          <input
            type="text"
            className="custom-search-input"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="recent-searches-section">
          <h3>Recent Searches</h3>
          <div className="recent-searches-list">
            {recentSearchesData.map((item, index) => (
              <div key={index} className="recent-search-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;
