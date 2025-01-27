import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaImage, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { getSubjects as loadSubjects, updatePost, deletePost, uploadPostImage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Editor from '@monaco-editor/react';

function PostDetail() {
  const { subjectId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [subjectId, postId]);

  const fetchPost = async () => {
    try {
      const subjects = await loadSubjects();
      const currentSubject = subjects.find(s => s.id === parseInt(subjectId));
      
      if (!currentSubject) {
        setError('Subject nicht gefunden');
        setLoading(false);
        return;
      }

      const currentPost = currentSubject.posts.find(p => p.id === parseInt(postId));
      
      if (!currentPost) {
        setError('Post nicht gefunden');
        setLoading(false);
        return;
      }

      setSubject(currentSubject);
      setPost(currentPost);
      setLoading(false);
    } catch (err) {
      setError('Fehler beim Laden des Posts');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Möchten Sie diesen Post wirklich löschen?')) {
      try {
        await deletePost(parseInt(subjectId), parseInt(postId));
        navigate('/subjects');
      } catch (err) {
        setError('Fehler beim Löschen des Posts');
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadPostImage(parseInt(subjectId), parseInt(postId), file);
        await fetchPost();
      } catch (err) {
        setError('Fehler beim Hochladen des Bildes');
      }
    }
  };

  const renderContent = (content) => {
    const sections = [];
    let currentText = '';
    const lines = content.split('\n');
    let inCodeBlock = false;
    let currentLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Start of code block
          if (currentText.trim()) {
            sections.push({ type: 'text', content: currentText });
            currentText = '';
          }
          currentLanguage = line.slice(3).trim();
          inCodeBlock = true;
        } else {
          // End of code block
          sections.push({ 
            type: 'code', 
            language: currentLanguage || 'javascript',
            content: currentText.trim()
          });
          currentText = '';
          inCodeBlock = false;
        }
      } else {
        if (inCodeBlock) {
          currentText += line + '\n';
        } else if (line.trim() || i < lines.length - 1) {
          currentText += line + '\n';
        }
      }
    }

    if (currentText.trim()) {
      sections.push({ 
        type: 'text',
        content: currentText.trim()
      });
    }

    return sections;
  };

  if (loading) return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{error}</h2>
          <Link 
            to="/subjects" 
            className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  if (!post || !subject) return null;

  const contentSections = renderContent(post.content);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/subjects" className="hover:text-blue-600">Subjects</Link>
            </li>
            <li>
              <span className="mx-2">›</span>
            </li>
            <li>
              <Link to="/subjects" className="hover:text-blue-600">{subject.title}</Link>
            </li>
            <li>
              <span className="mx-2">›</span>
            </li>
            <li className="text-gray-900 font-medium">{post.title}</li>
          </ol>
        </nav>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <header className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {subject.title}
                  </span>
                  <span className="mx-2">•</span>
                  <time>{new Date(post.date).toLocaleString()}</time>
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Löschen"
                  >
                    <FaTrash size={20} />
                  </button>
                  <label className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors cursor-pointer">
                    <FaImage size={20} title="Bild hochladen" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="prose prose-lg max-w-none space-y-6">
              {contentSections.map((section, index) => (
                <div key={index}>
                  {section.type === 'code' ? (
                    <div className="rounded-lg overflow-hidden border border-gray-200 not-prose bg-[#1e1e1e]">
                      <div className="bg-[#2d2d2d] text-gray-300 px-4 py-2 text-sm font-mono border-b border-gray-700 flex justify-between items-center">
                        <span>{section.language}</span>
                      </div>
                      <div style={{ height: `${Math.min(Math.max(section.content.split('\n').length * 22, 100), 400)}px` }}>
                        <Editor
                          height="100%"
                          language={section.language}
                          value={section.content}
                          theme="vs-dark"
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            domReadOnly: true,
                            renderValidationDecorations: "off",
                            padding: { top: 8, bottom: 8 },
                            folding: false,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-gray-700">{section.content}</div>
                  )}
                </div>
              ))}
            </div>

            {post.imageUrl && (
              <div className="mt-8">
                <img
                  src={post.imageUrl}
                  alt="Post Bild"
                  className="rounded-lg w-full object-cover shadow-md"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <Link 
                to="/subjects"
                className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
              >
                <FaArrowLeft className="mr-2" />
                Zurück zur Übersicht
              </Link>
              <span className="text-sm text-gray-500">
                Zuletzt aktualisiert: {new Date(post.date).toLocaleString()}
              </span>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}

export default PostDetail;
