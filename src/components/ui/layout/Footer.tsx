
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full bg-background/20 backdrop-blur-xl shadow-[0_-8px_32px_0_rgba(0,240,255,0.2)] border-t border-primary/30">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-primary">Company</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-primary">Resources</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/guides" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-primary">Legal</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-primary">Social</h3>
            <ul className="space-y-1">
              <li>
                <a href="https://twitter.com" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-primary/20 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MakersImpulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
