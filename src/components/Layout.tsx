
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative dark">
      <Navbar />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};
