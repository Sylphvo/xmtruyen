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
import { chevronBackOutline, searchOutline, star } from 'ionicons/icons';
import { mockVendors } from '../data/mockData';
import './VendorsList.css';

const tabs = ['All', 'Books', 'Poems', 'Special for you', 'Stationary'];

const VendorsList: React.FC = () => {
  const router = useIonRouter();
  const [activeTab, setActiveTab] = useState('All');

  return (
    <IonPage className="vendors-list-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="vendors-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="vendors-title">Vendords</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn">
            <IonIcon icon={searchOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="our-vendors-header">
          <p>Our Vendors</p>
          <h2>Vendords</h2>
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

        <div className="vendors-grid">
          {/* Duplicating mockVendors to show more items like in the design */}
          {[...mockVendors, ...mockVendors].map((vendor, index) => (
            <div key={`${vendor.id}-${index}`} className="vendor-grid-item">
              <div className="vendor-logo-wrapper">
                <span>{vendor.logo}</span>
              </div>
              <div className="vendor-stars">
                {[...Array(5)].map((_, i) => (
                  <IonIcon key={i} icon={star} className={i < Math.floor(vendor.rating) ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VendorsList;
