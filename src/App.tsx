
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routes';
import { AppInitializer } from './app/initializer/AppInitializer';
import { useAuthStore } from './auth/store/auth.store';
import { Toaster } from './shared/ui/toaster';
import { MainNav } from './app/layout/MainNav';
import { FloatingChat } from './components/FloatingChat';
import { Footer } from './app/components/Footer';
import './styles/cyberpunk.css';

function App() {
  const { initialize } = useAuthStore();
  
  // Initialize auth on app load
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return (
    <BrowserRouter>
      <AppInitializer>
        <div className="min-h-screen flex flex-col bg-black text-white">
          <MainNav />
          <main className="flex-1 mt-16">
            <Routes />
          </main>
          <Footer />
          <FloatingChat />
        </div>
        <Toaster />
      </AppInitializer>
    </BrowserRouter>
  );
}

export default App;
