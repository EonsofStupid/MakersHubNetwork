
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from '@/app/routes';
import { Toaster } from '@/shared/ui/core/toaster';
import { KeyboardNavigation } from '@/app/components/keyboard/KeyboardNavigation';

function App() {
  return (
    <Router>
      <Routes />
      <Toaster />
      <KeyboardNavigation />
    </Router>
  );
}

export default App;
