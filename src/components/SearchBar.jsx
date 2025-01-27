import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const subjects = [
    'Anwendungsentwicklung',
    'Wirtschaft',
    'IT-Systeme',
    'Datenbanken',
    'Englisch',
    'Politik'
  ];

  const recentPosts = [
    { id: 1, title: 'Present Perfect', subject: 'Englisch' },
    { id: 2, title: 'React Components', subject: 'Anwendungsentwicklung' }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
      setSearchTerm('');
    }
  };

  const handleLinkClick = () => {
    setShowSuggestions(false);
    setSearchTerm('');
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = recentPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Suche nach Posts..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {showSuggestions && (searchTerm || filteredSubjects.length > 0) && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {filteredSubjects.length > 0 && (
            <div className="p-2 border-b">
              <div className="text-xs font-semibold text-gray-500 mb-1">FÄCHER</div>
              {filteredSubjects.map((subject, index) => (
                <Link
                  key={index}
                  to={`/subject/${subject}`}
                  className="block px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  onClick={handleLinkClick}
                >
                  {subject}
                </Link>
              ))}
            </div>
          )}
          
          {filteredPosts.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-1">LETZTE POSTS</div>
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/subject/${post.subject}/post/${post.id}`}
                  className="block px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  onClick={handleLinkClick}
                >
                  {post.title}
                  <span className="text-xs text-gray-500 ml-2">in {post.subject}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
