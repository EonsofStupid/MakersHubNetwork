
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routes';
import { AppInitializer } from './app/initializer/AppInitializer';
import { useAuthStore } from './auth/store/auth.store';
import { Toaster } from './shared/ui/toaster';
import MainNav from './app/components/MainNav';

function App() {
  const { initialize } = useAuthStore();
  
  // Initialize auth on app load
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return (
    <BrowserRouter>
      <AppInitializer>
        <div className="min-h-screen flex flex-col">
          <MainNav />
          <main className="flex-1">
            <Routes />
          </main>
        </div>
        <Toaster />
      </AppInitializer>
    </BrowserRouter>
  );
}

export default App;
