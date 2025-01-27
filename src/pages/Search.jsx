import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as api from '../services/api';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (query) {
      searchPosts(query);
    } else {
      setSearchResults([]);
    }
  }, [query, allPosts]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const subjects = await api.getSubjects();
      
      // Sammle alle Posts aus allen Fächern
      const posts = subjects.flatMap(subject => 
        (subject.posts || []).map(post => ({
          ...post,
          subjectTitle: subject.title,
          subjectId: subject.id
        }))
      );

      setAllPosts(posts);
    } catch (err) {
      setError('Fehler beim Laden der Posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = (searchQuery) => {
    const results = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('search');
    setSearchParams({ q: newQuery });
  };

  if (loading && !searchResults.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-full mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-100 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="search"
            name="search"
            defaultValue={query}
            placeholder="Suche nach Posts..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Suchen
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {searchResults.map((post) => (
          <Link 
            key={post.id}
            to={`/subjects/${post.subjectId}/posts/${post.id}`}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm font-medium text-blue-600">
                    {post.subjectTitle}
                  </span>
                  <h3 className="text-xl font-semibold mt-1">{post.title}</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-2 line-clamp-3">{post.content}</p>
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {query && searchResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Keine Ergebnisse gefunden für "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
