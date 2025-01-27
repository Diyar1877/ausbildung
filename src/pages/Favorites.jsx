import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [posts] = useState([
    {
      id: 1,
      subject: 'Englisch',
      title: 'Present Perfect',
      date: '27.01.2025',
      content: 'Heute habe ich das Present Perfect gelernt...'
    },
    {
      id: 2,
      subject: 'Anwendungsentwicklung',
      title: 'React Components',
      date: '26.01.2025',
      content: 'Heute habe ich gelernt, wie man React Components erstellt...'
    }
  ]);

  useEffect(() => {
    // Favoriten aus dem localStorage laden
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);

    // Event Listener für Änderungen an den Favoriten
    const handleStorageChange = () => {
      const updatedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(updatedFavorites);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filtere die Posts, die als Favoriten markiert sind
  const favoritePosts = posts.filter(post => 
    favorites.some(fav => fav.id === post.id)
  );

  return (
    <div className="container mx-auto px-4 py-8 mb-32">
      <h1 className="text-3xl font-bold mb-8">Meine Favoriten</h1>
      
      {favoritePosts.length > 0 ? (
        <div className="space-y-6">
          {favoritePosts.map(post => (
            <Link
              key={post.id}
              to={`/subject/${post.subject}/post/${post.id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      {post.subject}
                    </span>
                    <h2 className="text-xl font-semibold mt-1">{post.title}</h2>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <FavoriteButton postId={post.id} subject={post.subject} />
                </div>
                <p className="text-gray-700">{post.content}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Favoriten</h3>
          <p className="mt-1 text-sm text-gray-500">
            Du hast noch keine Posts als Favoriten markiert.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
