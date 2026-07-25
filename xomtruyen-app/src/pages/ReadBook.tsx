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
  
  // Dummy text for reading
  const chapterText = `
    Chapter 1: The Beginning\n
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\n
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. \n\n
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\n
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\n
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. \n\n
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
  `;

  const [showBars, setShowBars] = useState(true);
  const [fontSize, setFontSize] = useState(16);

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
        <div 
          className="reading-text-container" 
          style={{ fontSize: `${fontSize}px` }}
        >
          {chapterText.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
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
