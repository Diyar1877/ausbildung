import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const allPosts = [
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
  ];

  const searchResults = allPosts.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query) ||
    post.subject.toLowerCase().includes(query)
  );

  return (
    <div className="container mx-auto px-4 py-8 mb-32">
      <div className="mb-8">
        <SearchBar />
      </div>

      <h2 className="text-2xl font-bold mb-6">
        {query ? `Suchergebnisse für "${query}"` : 'Alle Posts'}
      </h2>

      <div className="space-y-6">
        {searchResults.length > 0 ? (
          searchResults.map(post => (
            <Link
              key={post.id}
              to={`/subject/${post.subject}/post/${post.id}`}
              state={{ from: 'search' }}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      {post.subject}
                    </span>
                    <h3 className="text-xl font-semibold mt-1">{post.title}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <p className="text-gray-700">{post.content}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">Keine Posts gefunden.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
