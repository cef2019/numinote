import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

const PublicLayout = ({ isAuthenticated, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;