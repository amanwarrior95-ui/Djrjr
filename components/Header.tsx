import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 flex flex-col items-center justify-center text-center">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-3xl">✨</span>
        <h1 className="text-3xl md:text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-luminary-accent to-luminary-secondary">
          Luminary AI
        </h1>
      </div>
      <p className="text-gray-400 text-sm md:text-base max-w-md">
        Turn your imagination into reality. Type in Hindi or English.
      </p>
    </header>
  );
};