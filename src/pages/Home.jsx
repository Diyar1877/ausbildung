import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';

const Home = () => {
  const recentPosts = [
    {
      id: 1,
      subject: 'Englisch',
      title: 'Present Perfect',
      date: '27.01.2025',
      content: 'Heute habe ich das Present Perfect gelernt. Es wird verwendet, wenn eine Handlung in der Vergangenheit begonnen hat und bis zur Gegenwart andauert.',
    },
    {
      id: 2,
      subject: 'Anwendungsentwicklung',
      title: 'React Components',
      date: '26.01.2025',
      content: 'Heute habe ich gelernt, wie man React Components erstellt und verwendet.',
    }
  ];

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
          {recentPosts.map((post) => (
            <Link 
              key={post.id}
              to={`/subject/${post.subject}/post/${post.id}`}
              state={{ from: 'homepage' }}
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
                  <FavoriteButton postId={post.id} subject={post.subject} />
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
};

export default Home;
