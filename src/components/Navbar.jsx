import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const subjects = [
    'Anwendungsentwicklung',
    'Wirtschaft',
    'IT-Systeme',
    'Datenbanken',
    'Englisch',
    'Politik'
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="absolute left-8">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Ausbildung With DIDO
            </Link>
          </div>

          <div className="flex-1 flex justify-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">
              Projekte
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              Über mich
            </Link>
            <Link to="/favorites" className="text-gray-600 hover:text-gray-900">
              Favoriten
            </Link>
          </div>
          
          <div className="absolute right-8 flex items-center space-x-4">
            <div className="w-64">
              <SearchBar />
            </div>
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-10 w-64 bg-white shadow-lg shadow-t-lg rounded-lg border-t">
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Schulfächer</h2>
                  <div className="space-y-2">
                    {subjects.map((subject, index) => (
                      <Link
                        key={index}
                        to={`/subject/${subject}`}
                        className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subject}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
