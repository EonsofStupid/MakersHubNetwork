
import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { NotFound } from '@/app/components/NotFound';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<div>Home Page</div>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </RouterRoutes>
  );
}
