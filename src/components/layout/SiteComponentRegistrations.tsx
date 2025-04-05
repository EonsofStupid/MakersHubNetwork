
import React from 'react';
import { Logo } from '@/components/MainNav/components/Logo';
import { NavigationItems } from '@/components/MainNav/components/NavigationItems';
import { SearchButton } from '@/components/MainNav/components/SearchButton';
import { AuthSection } from '@/components/MainNav/components/AuthSection';
import { LoginSheet } from '@/components/MainNav/components/LoginSheet';
import { Footer } from '@/components/Footer';
import componentRegistry from '@/admin/services/componentRegistry';

/**
 * Registers all the site-level components with the component registry
 * This ensures that layouts can reference these components by name
 */
export function registerSiteComponents() {
  console.log('Registering site components');
  
  // Register MainNav components
  componentRegistry.registerComponent('Logo', Logo);
  componentRegistry.registerComponent('NavigationItems', NavigationItems);
  componentRegistry.registerComponent('SearchButton', SearchButton);
  componentRegistry.registerComponent('AuthSection', AuthSection);
  componentRegistry.registerComponent('LoginSheet', LoginSheet);
  
  // Register basic HTML components for layouts
  componentRegistry.registerComponent('nav', 'nav');
  componentRegistry.registerComponent('div', 'div');
  componentRegistry.registerComponent('footer', 'footer');
  componentRegistry.registerComponent('p', 'p');
  componentRegistry.registerComponent('span', 'span');
  componentRegistry.registerComponent('a', 'a');
  componentRegistry.registerComponent('ul', 'ul');
  componentRegistry.registerComponent('li', 'li');
  componentRegistry.registerComponent('h3', 'h3');
  
  // Icon components needed for the footer
  componentRegistry.registerComponent('TwitterIcon', (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ));
  
  componentRegistry.registerComponent('GithubIcon', (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ));
  
  componentRegistry.registerComponent('DiscordIcon', (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5Z" />
      <path d="M15 9c0 1.105-0.895 2-2 2s-2-0.895-2-2s0.895-2 2-2 S15 7.895 15 9z" />
      <path d="M9 14c0 1.105-0.895 2-2 2s-2-0.895-2-2 s0.895-2 2-2 S9 12.895 9 14z" />
      <path d="M17 14c0 1.105-0.895 2-2 2s-2-0.895-2-2 s0.895-2 2-2 S17 12.895 17 14z" />
    </svg>
  ));
  
  // UserMenu components
  componentRegistry.registerComponent('UserMenu', () => <div className="user-menu">User Menu Placeholder</div>);
  
  console.log('Site components registered:', componentRegistry.getRegisteredComponents());
}
