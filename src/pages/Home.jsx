import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const subjects = await api.getSubjects();
      
      // Sammle alle Posts aus allen Fächern
      const allPosts = subjects.flatMap(subject => 
        subject.posts.map(post => ({
          ...post,
          subjectName: subject.name
        }))
      );

      // Sortiere nach Datum, neueste zuerst
      const sortedPosts = allPosts.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setLatestPosts(sortedPosts);
    } catch (err) {
      setError('Fehler beim Laden der Posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Lade Posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-32">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Willkommen auf meiner Lernplattform
        </h1>
        <p className="text-lg text-gray-600">
          Hier dokumentiere ich meinen Lernfortschritt während der Ausbildung
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Neueste Posts</h2>
        <div className="space-y-6">
          {latestPosts.map((post) => (
            <Link 
              key={post.id}
              to={`/subject/${post.subjectName}/post/${post.id}`}
              state={{ from: 'homepage' }}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      {post.subjectName}
                    </span>
                    <h3 className="text-xl font-semibold mt-1">{post.title}</h3>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{post.content}</p>
                <div className="text-right">
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
