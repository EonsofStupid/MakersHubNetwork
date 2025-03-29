
import React from 'react';
import { Link } from 'react-router-dom';
import { HeroButtonProps } from '../../types';

export const HeroButton: React.FC<HeroButtonProps> = ({
  id,
  label,
  href,
  primary,
  secondary,
  onHover,
  onLeave
}) => {
  const getButtonClass = () => {
    if (primary) return 'hero-cta-primary group';
    if (secondary) return 'hero-cta-tertiary';
    return 'hero-cta-secondary';
  };

  return (
    <Link
      to={href}
      className={getButtonClass()}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onLeave(id)}
      id={id}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <span className="relative z-10">{label}</span>
    </Link>
  );
};
