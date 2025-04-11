
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from '@/app/routes';
import { Toaster } from '@/shared/ui/core/toaster';

function App() {
  return (
    <Router>
      <Routes />
      <Toaster />
    </Router>
  );
}

export default App;
