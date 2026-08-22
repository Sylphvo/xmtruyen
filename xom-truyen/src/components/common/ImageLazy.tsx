import React, { useState } from 'react';

interface ImageLazyProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const ImageLazy: React.FC<ImageLazyProps> = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzY2NiIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+', // Default placeholder base64
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? placeholder : (loaded ? src : placeholder)}
      alt={alt}
      className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-50'} ${className}`}
      onLoad={(e) => {
        setLoaded(true);
        if (props.onLoad) props.onLoad(e);
      }}
      onError={(e) => {
        setError(true);
        if (props.onError) props.onError(e);
      }}
      loading="lazy"
      {...props}
      style={{ ...props.style, transition: 'opacity 0.5s ease-in-out' }}
    />
  );
};
