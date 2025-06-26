import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          ERA <span className="text-indigo-400">835</span> File Generator
        </h1>
        <a 
            href="https://www.x12.org/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
        >
            X12 EDI Standard
        </a>
      </div>
    </header>
  );
};

export default Header;
