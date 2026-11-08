import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#050B18] text-slate-100 selection:bg-cobalt-600 selection:text-white">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
