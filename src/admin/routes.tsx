
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PlaceholderPage } from './routes/PlaceholderPage';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PlaceholderPage 
          title="Admin Dashboard" 
          description="Welcome to the admin dashboard"
        />
      } />
      <Route path="/users" element={
        <PlaceholderPage 
          title="User Management" 
          description="Manage user accounts and permissions"
        />
      } />
      <Route path="/content" element={
        <PlaceholderPage 
          title="Content Management" 
          description="Manage site content"
        />
      } />
      <Route path="/settings" element={
        <PlaceholderPage 
          title="System Settings" 
          description="Configure system settings"
          requiredPermission="admin.settings"
        />
      } />
      <Route path="*" element={
        <PlaceholderPage 
          title="Page Not Found" 
          description="The requested admin page could not be found"
        />
      } />
    </Routes>
  );
};
