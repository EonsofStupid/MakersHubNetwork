
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routes';
import { AppInitializer } from './core/init/AppInitializer';
import { Toaster } from './shared/ui/toaster';
import MainNav from './app/components/MainNav';

function App() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <div className="min-h-screen flex flex-col bg-black text-white">
          <MainNav />
          <main className="flex-1 mt-16">
            <Routes />
          </main>
        </div>
        <Toaster />
      </AppInitializer>
    </BrowserRouter>
  );
}

export default App;
