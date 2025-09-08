
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="text-4xl md:text-6xl font-bold text-amber-900 animate-landing animate-slide-in-up">
        Soundarya Lahari
      </h1>
      <h2 className="text-xl md:text-2xl text-amber-700 mt-2 animate-landing animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
        Your Guide to Divine Mantras
      </h2>
    </header>
  );
};

export default Header;