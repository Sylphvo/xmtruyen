import React from 'react';
import './PromoBanner.css';

const PromoBanner: React.FC = () => {
  return (
    <div className="promo-banner">
      <div className="promo-content">
        <h3>Special Offer</h3>
        <p>Discount 25%</p>
        <button className="promo-btn">Order Now</button>
      </div>
      <div className="promo-image">
        {/* Placeholder for the book image in promo */}
        <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src="https://images.unsplash.com/photo-1629196914539-775b8bece2b4?w=200&q=80" alt="Promo Book" />
      </div>
    </div>
  );
};

export default PromoBanner;
