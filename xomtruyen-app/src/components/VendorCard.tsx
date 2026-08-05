import React from 'react';
import './VendorCard.css';

interface VendorCardProps {
  name: string;
  logo: string;
}

const VendorCard: React.FC<VendorCardProps> = ({ name, logo }) => {
  return (
    <div className="vendor-card">
      <div className="vendor-logo-circle">
        <span>{logo}</span>
      </div>
    </div>
  );
};

export default VendorCard;
