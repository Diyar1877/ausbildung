import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 hidden md:block mt-auto">
      <div className="container mx-auto px-4 mt-15 p-15">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Lernplattform</h3>
            <p className="text-gray-400">Dokumentation meiner Ausbildung zum Fachinformatiker</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link to="/about" className="text-gray-400 hover:text-white">Über mich</Link>
            <Link to="/tutorials" className="text-gray-400 hover:text-white">Tutorials</Link>
            <Link to="/projects" className="text-gray-400 hover:text-white">Projekte</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400 text-sm">
          {new Date().getFullYear()} Lernplattform. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
