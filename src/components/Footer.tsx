
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-base footer-gradient footer-transform footer-animate relative">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row py-6 md:py-8 relative z-10">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MakersImpulse. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
