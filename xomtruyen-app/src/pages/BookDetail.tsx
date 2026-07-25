import React, { useMemo, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline, heart, removeOutline, addOutline, star } from 'ionicons/icons';
import { useParams } from 'react-router';
import { mockBooks } from '../data/mockData';
import './BookDetail.css';

const BookDetail: React.FC = () => {
  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  
  const book = useMemo(() => {
    return mockBooks.find(b => b.id === Number(id)) || mockBooks[0];
  }, [id]);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const increaseQuantity = () => {
    setQuantity(q => q + 1);
  };

  return (
    <IonPage className="book-detail-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="book-detail-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn back-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="book-cover-section">
          <div className="book-cover-large">
            <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={book.image} alt={book.title} />
          </div>
        </div>

        <div className="book-info-section">
          <div className="book-title-row">
            <h2>{book.title}</h2>
            <IonButton fill="clear" className="like-btn">
              <IonIcon icon={heart} />
            </IonButton>
          </div>
          
          <div className="book-vendor-label">
            <span className="vendor-logo-small">{book.vendor.charAt(0)}</span>
            <span className="vendor-name-small">{book.vendor}</span>
          </div>

          <p className="book-description">{book.description}</p>

          <div className="book-review-section">
            <h3>Review</h3>
            <div className="book-rating">
              {[...Array(5)].map((_, i) => (
                <IonIcon key={i} icon={star} className={i < Math.floor(book.rating) ? 'star-filled' : 'star-empty'} />
              ))}
              <span className="rating-value">({book.rating.toFixed(1)})</span>
            </div>
          </div>

          <div className="book-action-buttons">
          <button 
            className="read-book-btn"
            onClick={() => router.push(`/read-book/${book.id}`, 'forward')}
          >
            Read Book
          </button>
          <button className="add-to-cart-btn">
            Add To Cart
          </button>
        </div>

          <div className="book-action-section">
            <div className="quantity-selector">
              <button onClick={decreaseQuantity}><IonIcon icon={removeOutline} /></button>
              <span>{quantity}</span>
              <button onClick={increaseQuantity}><IonIcon icon={addOutline} /></button>
            </div>
            <div className="book-price-large">${book.price}</div>
          </div>

          <div className="book-buttons-row">
            <button className="continue-shopping-btn" onClick={() => router.goBack()}>Continue shopping</button>
            <button className="view-cart-btn" onClick={() => router.push('/tabs/cart', 'forward')}>View cart</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookDetail;
