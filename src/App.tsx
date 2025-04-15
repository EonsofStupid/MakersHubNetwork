
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routes';
import { SystemInitializer } from './core/init/SystemInitializer';
import { Toaster } from './shared/ui/toaster';
import { SiteThemeProvider } from './app/theme/SiteThemeProvider';
import { DebugController } from './core/debug/DebugController';
import { MainNav } from './app/layout/MainNav';

function App() {
  return (
    <BrowserRouter>
      <DebugController>
        <SystemInitializer>
          <SiteThemeProvider defaultTheme="default">
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <MainNav />
              <main className="flex-1 pt-16">
                <Routes />
              </main>
            </div>
            <Toaster />
          </SiteThemeProvider>
        </SystemInitializer>
      </DebugController>
    </BrowserRouter>
  );
}

export default App;
