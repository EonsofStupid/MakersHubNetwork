
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Placeholder for build routes
export default function BuildRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Build List Page</div>} />
      <Route path="/:id" element={<div>Build Detail Page</div>} />
    </Routes>
  );
}
