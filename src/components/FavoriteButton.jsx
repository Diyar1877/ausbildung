import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ postId, subject }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Beim Laden prüfen, ob der Post bereits favorisiert ist
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === postId));
  }, [postId]);

  const toggleFavorite = (e) => {
    e.preventDefault(); // Verhindert Navigation beim Klicken
    e.stopPropagation(); // Verhindert Bubble-up zum Parent

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Aus Favoriten entfernen
      const newFavorites = favorites.filter(fav => fav.id !== postId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      // Zu Favoriten hinzufügen
      const newFavorites = [...favorites, { id: postId, subject }];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(true);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className="text-gray-500 hover:text-yellow-500 transition-colors"
      title={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
    >
      {isFavorite ? (
        <svg className="w-6 h-6 fill-yellow-500" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )}
    </button>
  );
};

export default FavoriteButton;
