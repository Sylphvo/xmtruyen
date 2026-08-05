import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonFooter,
  useIonRouter,
} from '@ionic/react';
import { 
  chevronBackOutline, 
  settingsOutline, 
  listOutline, 
  bookmarkOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import './ReadBook.css';
import { mockBooks } from '../data/mockData';
import { useParams } from 'react-router';

const ReadBook: React.FC = () => {
  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();
  
  // Dummy comic pages for reading
  const comicPages = [
    'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    'https://images.unsplash.com/photo-1582653211939-93b567433246?w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-e513176f20b5?w=800&q=80'
  ];

  const [showBars, setShowBars] = useState(true);

  // Auto hide bars after 3 seconds for immersive reading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBars(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleBars = () => {
    setShowBars(!showBars);
  };

  const book = mockBooks.find(b => b.id === Number(id)) || mockBooks[0];

  return (
    <IonPage className="read-book-page">
      <div className={`read-header ${showBars ? 'show' : 'hide'}`}>
        <IonHeader className="ion-no-border">
          <IonToolbar className="read-toolbar">
            <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
            <IonTitle className="read-title">{book.title}</IonTitle>
            <IonButton fill="clear" slot="end" className="icon-btn">
              <IonIcon icon={settingsOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
      </div>

      <IonContent 
        fullscreen 
        scrollY={true} 
        className="read-content-area"
        onClick={toggleBars}
      >
        <div className="reading-comic-container">
          {comicPages.map((pageUrl, index) => (
            <img key={index} src={pageUrl} alt={`Page ${index + 1}`} className="comic-page" />
          ))}
        </div>
      </IonContent>

      <div className={`read-footer ${showBars ? 'show' : 'hide'}`}>
        <IonFooter className="ion-no-border">
          <IonToolbar className="read-footer-toolbar">
            <div className="reading-progress-container">
              <span className="progress-text">Chapter 1 of 42</span>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '5%' }}></div>
              </div>
            </div>
            <div className="reading-actions">
              <IonButton fill="clear" className="reading-action-btn disabled">
                <IonIcon icon={chevronBackOutline} slot="start" /> Prev
              </IonButton>
              <div className="center-actions">
                <IonButton fill="clear" className="icon-btn-small">
                  <IonIcon icon={listOutline} />
                </IonButton>
                <IonButton fill="clear" className="icon-btn-small">
                  <IonIcon icon={bookmarkOutline} />
                </IonButton>
              </div>
              <IonButton fill="clear" className="reading-action-btn">
                Next <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </div>
          </IonToolbar>
        </IonFooter>
      </div>
    </IonPage>
  );
};

export default ReadBook;
