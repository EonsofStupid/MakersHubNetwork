
import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="py-4 border-b bg-background">
      <div className="container flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-primary">3D Printer Hub</Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <Link to="/community" className="hover:text-primary transition-colors">Community</Link>
          <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
        </nav>
      </div>
    </header>
  );
}
