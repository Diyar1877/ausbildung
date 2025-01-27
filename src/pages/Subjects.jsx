import React from 'react';
import { Link } from 'react-router-dom';

const Subjects = () => {
  const subjects = [
    'Anwendungsentwicklung',
    'Wirtschaft',
    'IT-Systeme',
    'Datenbanken',
    'Englisch',
    'Politik'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Fächer</h1>
      <div className="grid gap-4">
        {subjects.map((subject, index) => (
          <Link
            key={index}
            to={`/subject/${subject}`}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl text-gray-800">{subject}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
