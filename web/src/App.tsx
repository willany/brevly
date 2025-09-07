import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Redirect } from './pages/Redirect';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:shortUrl' element={<Redirect />} />
      <Route path='/404' element={<NotFound />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};
