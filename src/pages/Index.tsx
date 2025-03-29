
import React from 'react';
import { Provider } from 'jotai';
import IndexPage from '@/features/landing';

const Index = () => {
  return (
    <Provider>
      <IndexPage />
    </Provider>
  );
};

export default Index;
