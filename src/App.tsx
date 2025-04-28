
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/AuthProvider';
import PrivateRoute from '@/components/PrivateRoute';
import UserMenu from '@/components/UserMenu';

// Import pages
import Index from './pages/Index';
import FeedingGuide from './pages/FeedingGuide';
import WeatherCare from './pages/WeatherCare';
import PondFeeding from './pages/PondFeeding';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="prawn-guru-theme">
      <BrowserRouter>
        <AuthProvider>
          <UserMenu />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/feeding-guide" element={<FeedingGuide />} />
              <Route path="/weather-care" element={<WeatherCare />} />
              <Route path="/pond-feeding" element={<PondFeeding />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
