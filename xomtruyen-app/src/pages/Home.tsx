import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import { searchOutline, notificationsOutline } from 'ionicons/icons';
import PromoBanner from '../components/PromoBanner';
import BookCard from '../components/BookCard';
import VendorCard from '../components/VendorCard';
import AuthorAvatar from '../components/AuthorAvatar';
import { mockBooks, mockVendors, mockAuthors } from '../data/mockData';
import './Home.css';

const Home: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="home-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="home-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn">
            <IonIcon icon={searchOutline} />
          </IonButton>
          <IonTitle className="home-title">Home</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn relative-icon" onClick={() => router.push('/notifications', 'forward')}>
            <IonIcon icon={notificationsOutline} />
            <div className="notification-dot"></div>
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <PromoBanner />

        {/* Top of Week */}
        <div className="section-header">
          <h2>Top of Week</h2>
          <span className="see-all">See all</span>
        </div>
        <div className="horizontal-scroll hide-scrollbar">
          {mockBooks.map(book => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

        {/* Best Vendors */}
        <div className="section-header">
          <h2>Best Vendors</h2>
          <span className="see-all" onClick={() => router.push('/vendors', 'forward')}>See all</span>
        </div>
        <div className="horizontal-scroll hide-scrollbar">
          {mockVendors.map(vendor => (
            <VendorCard key={vendor.id} {...vendor} />
          ))}
        </div>

        {/* Authors */}
        <div className="section-header">
          <h2>Authors</h2>
          <span className="see-all" onClick={() => router.push('/authors', 'forward')}>See all</span>
        </div>
        <div className="horizontal-scroll hide-scrollbar" style={{ marginBottom: '30px' }}>
          {mockAuthors.map(author => (
            <AuthorAvatar key={author.id} {...author} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

