
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black to-transparent border-t border-primary/10 mt-16">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 cyber-text">IMPULSE</h3>
            <p className="text-muted-foreground mb-4">
              The ultimate community for 3D printing enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/guides" className="text-muted-foreground hover:text-primary transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-muted-foreground hover:text-primary transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/forum" className="text-muted-foreground hover:text-primary transition-colors">
                  Forums
                </Link>
              </li>
              <li>
                <Link to="/discord" className="text-muted-foreground hover:text-primary transition-colors">
                  Discord
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/meetups" className="text-muted-foreground hover:text-primary transition-colors">
                  Meetups
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IMPULSE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
