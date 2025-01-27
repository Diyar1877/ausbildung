import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const recentPosts = [
    {
      id: 1,
      title: 'Erste Schritte mit React',
      excerpt: 'Heute habe ich gelernt, wie man eine React-App erstellt und Components verwendet.',
      date: '27. Januar 2025',
      category: 'React'
    },
    {
      id: 2,
      title: 'HTML & CSS Grundlagen',
      excerpt: 'Die wichtigsten HTML-Tags und CSS-Eigenschaften für Webentwicklung.',
      date: '26. Januar 2025',
      category: 'Web'
    },
    {
      id: 3,
      title: 'JavaScript Arrays',
      excerpt: 'Methoden wie map, filter und reduce für die Array-Verarbeitung.',
      date: '25. Januar 2025',
      category: 'JavaScript'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mb-32">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Willkommen auf meiner Lernplattform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Hier dokumentiere ich meine Reise zum Fachinformatiker für Anwendungsentwicklung
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Neueste Beiträge</h2>
        <div className="space-y-6">
          {recentPosts.map(post => (
            <article key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm text-gray-500 mb-2">{post.date} • {post.category}</div>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link to={`/post/${post.id}`} className="text-blue-600 hover:text-blue-800">
                Weiterlesen →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Tutorials</h2>
          <p className="text-gray-600 mb-4">
            Entdecke strukturierte Tutorials zu verschiedenen Programmier-Themen.
          </p>
          <Link to="/tutorials" className="text-blue-600 hover:text-blue-800">
            Zu den Tutorials →
          </Link>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Projekte</h2>
          <p className="text-gray-600 mb-4">
            Sieh dir meine praktischen Projekte aus der Ausbildung an.
          </p>
          <Link to="/projects" className="text-blue-600 hover:text-blue-800">
            Zu den Projekten →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
