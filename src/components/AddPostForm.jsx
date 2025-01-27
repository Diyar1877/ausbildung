import React, { useState } from 'react';

const AddPostForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    content: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Neuer Eintrag</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Fach
            </label>
            <select
              className="w-full p-2 border rounded"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            >
              <option value="">Fach auswählen</option>
              <option value="Anwendungsentwicklung">Anwendungsentwicklung</option>
              <option value="Wirtschaft">Wirtschaft</option>
              <option value="IT-Systeme">IT-Systeme</option>
              <option value="Datenbanken">Datenbanken</option>
              <option value="Englisch">Englisch</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Titel
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Inhalt
            </label>
            <textarea
              className="w-full p-2 border rounded"
              rows="4"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostForm;
