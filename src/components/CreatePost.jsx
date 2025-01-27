import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    content: ''
  });

  const subjects = [
    'Anwendungsentwicklung',
    'Wirtschaft',
    'IT-Systeme',
    'Datenbanken',
    'Englisch',
    'Politik'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aktuelles Datum im Format DD.MM.YYYY
    const today = new Date();
    const date = today.toLocaleDateString('de-DE');

    // Hole existierende Posts aus dem localStorage oder erstelle leeres Array
    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    // Erstelle neuen Post
    const newPost = {
      id: Date.now(), // Verwende Timestamp als eindeutige ID
      ...formData,
      date
    };
    
    // Füge neuen Post am Anfang der Liste hinzu
    const updatedPosts = [newPost, ...existingPosts];
    
    // Speichere aktualisierte Posts
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    
    // Zurück zur Startseite
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Neuer Lerneintrag</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fach
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">Fach auswählen</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titel
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="z.B. JavaScript Grundlagen"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Was habe ich gelernt?
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Beschreibe, was du heute gelernt hast..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
