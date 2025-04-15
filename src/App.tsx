
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routes';
import { AppInitializer } from './core/init/AppInitializer';
import { Toaster } from './shared/ui/toaster';
import { SiteThemeProvider } from './app/theme/SiteThemeProvider';
import { ThemeLoadingState } from './shared/ui/theme/info/ThemeLoadingState';
import { ThemeErrorState } from './shared/ui/theme/info/ThemeErrorState';
import { useThemeStore } from './shared/stores/theme/themeStore';

function App() {
  const { isLoading, error } = useThemeStore();

  return (
    <BrowserRouter>
      <AppInitializer>
        <SiteThemeProvider defaultTheme="default">
          {isLoading ? (
            <ThemeLoadingState />
          ) : error ? (
            <ThemeErrorState 
              error={new Error(error)}
              onRetry={() => useThemeStore.getState().fetchThemes()}
            />
          ) : (
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <main className="flex-1">
                <Routes />
              </main>
            </div>
          )}
          <Toaster />
        </SiteThemeProvider>
      </AppInitializer>
    </BrowserRouter>
  );
}

export default App;
