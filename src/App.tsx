
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routes';
import { MainNav } from './app/layout/MainNav';
import { Footer } from './app/components/Footer';
import { Toaster } from './shared/ui/toaster';
import './styles/cyberpunk.css';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <MainNav />
        <main className="flex-1 mt-16">
          <Routes />
        </main>
        <Footer />
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
