import React from 'react';
import { useParams, Link } from 'react-router-dom';

const SubjectPosts = () => {
  const { subject } = useParams();

  const posts = {
    'Englisch': [
      {
        title: 'Present Perfect',
        date: '27.01.2025',
        content: 'Heute habe ich das Present Perfect gelernt. Es wird verwendet, wenn eine Handlung in der Vergangenheit begonnen hat und bis zur Gegenwart andauert. Beispiele:\n- I have lived here for 10 years\n- She has worked at this company since 2020',
        id: 1
      },
      {
        title: 'Business Emails',
        date: '25.01.2025',
        content: 'Heute haben wir gelernt, wie man professionelle E-Mails auf Englisch schreibt.',
        id: 2
      }
    ],
    'Anwendungsentwicklung': [
      {
        title: 'React Components',
        date: '26.01.2025',
        content: 'Heute habe ich gelernt, wie man React Components erstellt und verwendet.',
        id: 3
      }
    ],
    // Weitere Fächer können hier hinzugefügt werden
  };

  const subjectPosts = posts[subject] || [];

  return (
    <div className="container mx-auto px-4 py-8 mb-32">
      <h1 className="text-3xl font-bold mb-8">{subject}</h1>
      <div className="space-y-8">
        {subjectPosts.map((post) => (
          <Link 
            key={post.id}
            to={`/subject/${subject}/post/${post.id}`}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <p className="text-gray-700 mb-4">{post.content}</p>
              <span className="text-blue-600">
                Weiterlesen →
              </span>
            </div>
          </Link>
        ))}
        {subjectPosts.length === 0 && (
          <p className="text-gray-500">Noch keine Einträge für dieses Fach.</p>
        )}
      </div>
    </div>
  );
};

export default SubjectPosts;
