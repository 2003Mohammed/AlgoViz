
import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { TutorAssistant } from './TutorAssistant';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative theme-transition">
      <Navigation />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />
      <TutorAssistant />
    </div>
  );
};
