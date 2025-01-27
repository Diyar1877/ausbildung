import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-lg hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="absolute left-8">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Ausbildung With DIDO
              </Link>
            </div>

            <div className="flex-1 flex justify-center space-x-8">
              <Link to="/" className={`${isActive('/') ? 'bg-gray-900 text-white' : 'text-gray-600'} px-3 py-2 rounded-md`}>
                Home
              </Link>
              <Link to="/projects" className={`${isActive('/projects') ? 'bg-gray-900 text-white' : 'text-gray-600'} px-3 py-2 rounded-md`}>
                Projekte
              </Link>
              <Link to="/favorites" className={`${isActive('/favorites') ? 'bg-gray-900 text-white' : 'text-gray-600'} px-3 py-2 rounded-md`}>
                Favoriten
              </Link>
              <Link to="/subjects" className={`${isActive('/subjects') ? 'bg-gray-900 text-white' : 'text-gray-600'} px-3 py-2 rounded-md`}>
                Fächer
              </Link>
              <Link to="/search" className={`${isActive('/search') ? 'bg-gray-900 text-white' : 'text-gray-600'} px-3 py-2 rounded-md`}>
                Suche
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="bg-white shadow-lg md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Ausbildung With DIDO
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around py-2">
          <Link 
            to="/" 
            className={`flex flex-col items-center ${isActive('/') ? 'text-white bg-gray-900' : 'text-gray-600'} rounded-md p-2`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link 
            to="/search" 
            className={`flex flex-col items-center ${isActive('/search') ? 'text-white bg-gray-900' : 'text-gray-600'} rounded-md p-2`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs mt-1">Suche</span>
          </Link>
          <Link 
            to="/favorites" 
            className={`flex flex-col items-center ${isActive('/favorites') ? 'text-white bg-gray-900' : 'text-gray-600'} rounded-md p-2`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs mt-1">Favoriten</span>
          </Link>
          <Link 
            to="/subjects"
            className={`flex flex-col items-center ${isActive('/subjects') ? 'text-white bg-gray-900' : 'text-gray-600'} rounded-md p-2`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs mt-1">Fächer</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
