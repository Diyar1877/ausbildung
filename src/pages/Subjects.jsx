import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export default function Subjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Lade die Fächer beim ersten Render
  useEffect(() => {
    loadSubjects();
  }, []);

  // Funktion zum Laden der Fächer
  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSubjects();
      setSubjects(data);
    } catch (err) {
      setError('Fehler beim Laden der Fächer');
      console.error('Error loading subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject) {
      alert('Bitte wählen Sie ein Fach aus');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Finde die subject ID
      const subject = subjects.find(s => s.name === selectedSubject);
      if (!subject) {
        throw new Error('Fach nicht gefunden');
      }

      // Erstelle den Post über die API
      const newPostData = {
        title: newPost.title,
        content: newPost.content,
        date: newPost.date
      };

      const createdPost = await api.createPost(subject.id, newPostData);

      // Aktualisiere die lokale State mit dem neuen Post
      setSubjects(prevSubjects => 
        prevSubjects.map(s => {
          if (s.id === subject.id) {
            return {
              ...s,
              posts: [createdPost, ...s.posts]
            };
          }
          return s;
        })
      );

      // Reset Form
      setNewPost({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedSubject('');
      setShowAddForm(false);

      // Zeige Erfolgsmeldung
      alert('Post erfolgreich erstellt!');
    } catch (err) {
      setError('Fehler beim Erstellen des Posts');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Lade Fächer...</div>
        </div>
      </div>
    );
  }

  if (error && subjects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Fächer</h1>
        {user?.isAdmin && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
            Sie sind als Admin eingeloggt
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{subject.name}</h2>
            </div>
            <div className="space-y-3">
              {subject.posts.map((post) => (
                <div key={post.id} className="border-b pb-2">
                  <Link 
                    to={`/subject/${subject.name}/post/${post.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-500">{post.date}</p>
                </div>
              ))}
              {subject.posts.length === 0 && (
                <p className="text-gray-500 text-sm italic">Noch keine Posts vorhanden</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Add Post Button */}
      {user?.isAdmin && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleAddPost}
            disabled={loading}
            className="w-[400px] h-[90px] bg-white border-2 border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <span className="text-4xl text-black">+</span>
            <span className="text-xl text-black">Neuer Post</span>
          </button>
        </div>
      )}

      {/* Add Post Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Neuer Post</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fach auswählen</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Bitte wählen Sie ein Fach</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Titel</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Inhalt</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Datum</label>
                <input
                  type="date"
                  value={newPost.date}
                  onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  disabled={loading}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Wird erstellt...' : 'Post erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
