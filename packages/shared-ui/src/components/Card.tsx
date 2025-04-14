import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  elevation?: 'low' | 'medium' | 'high';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  elevation = 'medium',
  className = '',
}) => {
  return (
    <div className={`card card-${elevation} ${className}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card; 