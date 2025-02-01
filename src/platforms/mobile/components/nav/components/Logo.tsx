import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link 
      to="/" 
      className="relative text-xl font-bold text-primary"
    >
      <span className="relative z-10">
        MakersImpulse
      </span>
      <div 
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-sm opacity-50"
      />
    </Link>
  );
};