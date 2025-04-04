
import React from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="flex-1">
        {/* Content will be rendered by AppRoutes */}
      </main>
      <Footer />
    </div>
  );
}
