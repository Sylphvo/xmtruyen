import React from 'react';
import { useIonRouter } from '@ionic/react';
import './AuthorAvatar.css';

interface AuthorAvatarProps {
  id: number;
  name: string;
  role: string;
  image: string;
}

const AuthorAvatar: React.FC<AuthorAvatarProps> = ({ id, name, role, image }) => {
  const router = useIonRouter();

  return (
    <div className="author-avatar-card" onClick={() => router.push(`/author-detail/${id}`, 'forward')}>
      <div className="author-image-wrapper">
        <img onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/e0e0e0/513b86?text=No+Image"; }} src={image} alt={name} />
      </div>
      <h5 className="author-name">{name}</h5>
      <p className="author-role">{role}</p>
    </div>
  );
};

export default AuthorAvatar;
