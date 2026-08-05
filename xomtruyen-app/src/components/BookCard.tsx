import React from 'react';
import { useIonRouter } from '@ionic/react';
import './BookCard.css';

interface BookCardProps {
  id: number;
  title: string;
  author?: string;
  price: number;
  image: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, price, image }) => {
  const router = useIonRouter();

  return (
    <div className="book-card" onClick={() => router.push(`/book-detail/${id}`, 'forward')}>
      <div className="book-image-container">
        <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={image} alt={title} className="book-image" />
      </div>
      <h4 className="book-title">{title}</h4>
      {author && <p className="book-author">{author}</p>}
      <p className="book-price">${price}</p>
    </div>
  );
};

export default BookCard;
