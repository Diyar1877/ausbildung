import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaImage, FaPlus, FaTimes, FaExpand, FaCode, FaGripVertical } from 'react-icons/fa';
import { getSubjects as loadSubjects, createPost, updatePost, deletePost, uploadPostImage, createSubject, updateSubject, deleteSubject } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Editor from '@monaco-editor/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RichTextEditor from '../components/RichTextEditor';

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function EditorSection({ section, index, onUpdate, onRemove, onLanguageChange, supportedLanguages }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `section-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-blue-400">
            <FaGripVertical />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {section.type === 'code' ? 'Code' : 'Text'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {section.type === 'code' && (
            <select
              value={section.language}
              onChange={(e) => onLanguageChange(index, e.target.value)}
              className="text-sm bg-white border border-gray-300 rounded px-2 py-1"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <RichTextEditor
          value={section.content || ''}
          onChange={(content) => onUpdate(index, content)}
          isCode={section.type === 'code'}
        />
      </div>
    </div>
  );
}

function PostForm({ isVisible, onClose, editingPost = null, subjects }) {
  const [title, setTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sections, setSections] = useState([{ type: 'text', content: '' }]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [error, setError] = useState('');

  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'csharp', name: 'C#' },
    { id: 'cpp', name: 'C++' },
    { id: 'php', name: 'PHP' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'swift', name: 'Swift' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setSelectedSubject(subjects.find(s => s.id === editingPost.subjectId)?.title || '');
      // Parse content and set sections
      const parsedSections = parseContent(editingPost.content);
      setSections(parsedSections);
    } else {
      resetForm();
    }
  }, [editingPost, subjects]);

  const parseContent = (content) => {
    if (!content) return [{ type: 'text', content: '' }];
    
    const sections = [];
    const lines = content.split('\n');
    let currentSection = { type: 'text', content: '' };
    
    for (let line of lines) {
      if (line.startsWith('```')) {
        if (currentSection.type === 'text') {
          if (currentSection.content) {
            sections.push({ ...currentSection });
          }
          const language = line.slice(3).trim();
          currentSection = { type: 'code', language: language || 'javascript', content: '' };
        } else {
          sections.push({ ...currentSection });
          currentSection = { type: 'text', content: '' };
        }
      } else {
        currentSection.content += (currentSection.content ? '\n' : '') + line;
      }
    }
    
    if (currentSection.content) {
      sections.push(currentSection);
    }
    
    return sections.length ? sections : [{ type: 'text', content: '' }];
  };

  const resetForm = () => {
    setTitle('');
    setSelectedSubject('');
    setSections([{ type: 'text', content: '' }]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subject = subjects.find(s => s.title === selectedSubject);
      if (!subject) {
        setError('Bitte wählen Sie ein Subject aus');
        return;
      }

      const combinedContent = sections.map(section => {
        if (section.type === 'code') {
          return `\n\`\`\`${section.language}\n${section.content}\n\`\`\`\n`;
        }
        return section.content;
      }).join('\n');

      const postData = {
        title,
        content: combinedContent,
        date: new Date().toISOString(),
        subjectId: subject.id
      };

      if (editingPost) {
        await updatePost(subject.id, editingPost.id, postData);
      } else {
        await createPost(subject.id, postData);
      }

      resetForm();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = parseInt(active.id.split('-')[1]);
        const newIndex = parseInt(over.id.split('-')[1]);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddSection = (type, index) => {
    const newSection = type === 'code' 
      ? { type: 'code', language: selectedLanguage, content: '' }
      : { type: 'text', content: '' };
    
    setSections(prev => [
      ...prev.slice(0, index + 1),
      newSection,
      ...prev.slice(index + 1)
    ]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden flex items-start justify-center">
      <div className="relative w-full max-w-4xl m-4 mt-8">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col max-h-[calc(100vh-4rem)]">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingPost ? 'Post bearbeiten' : 'Neuer Post'}
            </h2>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Subject auswählen</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.title}>
                        {subject.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Inhalt
                </label>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sections.map((_, index) => `section-${index}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {sections.map((section, index) => (
                        <EditorSection
                          key={`section-${index}`}
                          section={section}
                          index={index}
                          onUpdate={(index, content) => {
                            setSections(prev => prev.map((s, i) => 
                              i === index ? { ...s, content } : s
                            ));
                          }}
                          onRemove={(index) => {
                            setSections(prev => 
                              prev.length > 1 
                                ? prev.filter((_, i) => i !== index)
                                : [{ type: 'text', content: '' }]
                            );
                          }}
                          onLanguageChange={(index, language) => {
                            setSections(prev => prev.map((s, i) => 
                              i === index ? { ...s, language } : s
                            ));
                          }}
                          supportedLanguages={supportedLanguages}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleAddSection('text', sections.length - 1)}
                    className="inline-flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Text hinzufügen
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSection('code', sections.length - 1)}
                    className="inline-flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <FaCode className="mr-2" />
                    Code Block hinzufügen
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                form="post-form"
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingPost ? 'Aktualisieren' : 'Erstellen'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubjectForm({ isVisible, onClose, editingSubject = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingSubject) {
      setTitle(editingSubject.title);
      setDescription(editingSubject.description);
    } else {
      resetForm();
    }
  }, [editingSubject]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, {
          title,
          description,
        });
      } else {
        await createSubject({
          title,
          description,
        });
      }
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden flex items-start justify-center">
      <div className="relative w-full max-w-md m-4 mt-8">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingSubject ? 'Fach bearbeiten' : 'Neues Fach erstellen'}
            </h2>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="z.B. JavaScript, Python, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                required
                placeholder="Beschreiben Sie das Fach..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingSubject ? 'Aktualisieren' : 'Erstellen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [editorSections, setEditorSections] = useState([{ type: 'text', content: '' }]);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostDetailVisible, setIsPostDetailVisible] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isSubjectFormVisible, setIsSubjectFormVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'csharp', name: 'C#' },
    { id: 'cpp', name: 'C++' },
    { id: 'php', name: 'PHP' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'swift', name: 'Swift' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await loadSubjects();
      setSubjects(data);
      setLoading(false);
    } catch (err) {
      setError('Fehler beim Laden der Subjects');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subject = subjects.find(s => s.title === selectedSubject);
      if (!subject) {
        setError('Bitte wählen Sie ein Subject aus');
        return;
      }

      // Kombiniere alle Sektionen zu einem Inhalt
      const combinedContent = editorSections.map(section => {
        if (section.type === 'code') {
          return `\n\`\`\`${section.language}\n${section.content}\n\`\`\`\n`;
        }
        return section.content;
      }).join('\n');

      const postData = {
        title,
        content: combinedContent,
        date: new Date().toISOString(),
        subjectId: subject.id
      };

      if (editingPost) {
        await updatePost(subject.id, editingPost.id, postData);
      } else {
        await createPost(subject.id, postData);
      }

      // Reset form
      setTitle('');
      setEditorSections([{ type: 'text', content: '' }]);
      setSelectedSubject('');
      setEditingPost(null);
      setIsFormVisible(false);
      
      await fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setEditorSections(post.content.split('\n').map(line => ({
      type: line.startsWith('```') ? 'code' : 'text',
      language: line.startsWith('```') ? line.slice(3, line.indexOf('\n')).trim() : '',
      content: line.replace(/^```[\w]+/, '').replace(/\n$/, '')
    })));
    setSelectedSubject(subjects.find(s => s.id === post.subjectId)?.title || '');
  };

  const handleDeletePost = async (subjectId, postId) => {
    if (window.confirm('Möchten Sie diesen Post wirklich löschen?')) {
      try {
        await deletePost(subjectId, postId);
        await fetchSubjects();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleImageUpload = async (subjectId, postId, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadPostImage(subjectId, postId, file);
        await fetchSubjects();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePostClick = (post, subjectId) => {
    // Stelle sicher, dass die IDs als Zahlen übergeben werden
    const numericSubjectId = parseInt(subjectId);
    const numericPostId = parseInt(post.id);
    
    // Navigiere zur Post-Detail-Seite
    navigate(`/subjects/${numericSubjectId}/posts/${numericPostId}`);
  };

  const handleInlineImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('/api/upload-inline-image', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        // Füge das Bild in den Editor-Inhalt ein
        const imageMarkdown = `\n![${file.name}](${data.imageUrl})\n`;
        setEditorSections(prev => [
          ...prev,
          { type: 'text', content: imageMarkdown }
        ]);
      } catch (err) {
        console.error('Fehler beim Hochladen des Bildes:', err);
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setEditorSections((sections) => {
        const oldIndex = sections.findIndex((section, index) => `section-${index}` === active.id);
        const newIndex = sections.findIndex((section, index) => `section-${index}` === over.id);
        
        return arrayMove(sections, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateSection = (index, content) => {
    setEditorSections(prev => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        content
      };
      return newSections;
    });
  };

  const handleAddCodeSection = (index) => {
    setEditorSections(prev => {
      const newSections = [...prev];
      newSections.splice(index + 1, 0, {
        type: 'code',
        language: selectedLanguage,
        content: ''
      });
      return newSections;
    });
  };

  const handleRemoveSection = (index) => {
    setEditorSections(prev => {
      if (prev.length <= 1) {
        return [{ type: 'text', content: '' }];
      }
      const newSections = prev.filter((_, i) => i !== index);
      return newSections;
    });
  };

  const handleLanguageChange = (index, language) => {
    setEditorSections(prev => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        language
      };
      return newSections;
    });
  };

  const stripCodeBlocks = (content) => {
    if (!content) return '';
    
    let result = '';
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeContent = '';

    for (let line of lines) {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Start eines Code-Blocks
          inCodeBlock = true;
          codeContent = '';
        } else {
          // Ende eines Code-Blocks
          inCodeBlock = false;
          result += `[Code: ${codeContent.trim()}] `;
        }
      } else if (inCodeBlock) {
        codeContent += line + ' ';
      } else {
        result += line + ' ';
      }
    }

    return result.trim();
  };

  const moveSection = (index, direction) => {
    const newSections = [...editorSections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setEditorSections(newSections);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setIsSubjectFormVisible(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Möchten Sie dieses Fach wirklich löschen? Alle zugehörigen Posts werden ebenfalls gelöscht.')) {
      try {
        await deleteSubject(subjectId);
        await fetchSubjects();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Lade...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 relative min-h-screen">
      {/* Liste der Subjects und Posts */}
      <div className="space-y-8 mb-24">
        {subjects.map((subject) => (
          <div key={subject.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{subject.title}</h2>
                <p className="text-gray-600 mt-1">{subject.description}</p>
              </div>
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSubject(subject)}
                    className="text-blue-500 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"
                    title="Fach bearbeiten"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                    title="Fach löschen"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="divide-y divide-gray-100">
              {subject.posts && subject.posts.map((post) => (
                <div 
                  key={post.id} 
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handlePostClick(post, subject.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <p className="text-gray-700 mt-2 line-clamp-3">
                        {stripCodeBlocks(post.content)}
                      </p>
                      {post.content && post.content.includes('```') && (
                        <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                          <FaCode className="mr-1" />
                          Enthält Code
                        </span>
                      )}
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Post Bild"
                          className="mt-3 rounded-lg max-h-48 object-cover"
                        />
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(post.date).toLocaleString()}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-3 ml-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-500 hover:text-blue-600 p-2"
                          title="Bearbeiten"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(subject.id, post.id)}
                          className="text-red-500 hover:text-red-600 p-2"
                          title="Löschen"
                        >
                          <FaTrash size={18} />
                        </button>
                        <label className="cursor-pointer text-green-500 hover:text-green-600 p-2">
                          <FaImage size={18} title="Bild hochladen" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(subject.id, post.id, e)}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {(!subject.posts || subject.posts.length === 0) && (
                <p className="text-gray-500 p-4">Noch keine Posts vorhanden.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-70 transition-opacity z-30 flex items-center justify-center ${
            isPostDetailVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsPostDetailVisible(false)}
        >
          <div 
            className={`bg-white rounded-lg shadow-2xl transform transition-all duration-300 max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto ${
              isPostDetailVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedPost.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {subjects.find(s => s.id === selectedPost.subjectId)?.title || 'Unbekanntes Subject'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          handleEditPost(selectedPost);
                          setIsPostDetailVisible(false);
                          setIsFormVisible(true);
                        }}
                        className="text-blue-500 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"
                        title="Bearbeiten"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Möchten Sie diesen Post wirklich löschen?')) {
                            handleDeletePost(selectedPost.subjectId, selectedPost.id);
                            setIsPostDetailVisible(false);
                          }
                        }}
                        className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Löschen"
                      >
                        <FaTrash size={18} />
                      </button>
                      <label className="cursor-pointer text-green-500 hover:text-green-600 p-2 hover:bg-green-50 rounded-full transition-colors">
                        <FaImage size={18} title="Bild hochladen" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageUpload(selectedPost.subjectId, selectedPost.id, e);
                            if (e.target.files[0]) {
                              setIsPostDetailVisible(false);
                            }
                          }}
                        />
                      </label>
                    </>
                  )}
                  <button
                    onClick={() => setIsPostDetailVisible(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
                {selectedPost.imageUrl && (
                  <img
                    src={selectedPost.imageUrl}
                    alt="Post Bild"
                    className="mt-4 rounded-lg w-full object-cover"
                  />
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Veröffentlicht am {new Date(selectedPost.date).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons - nur für Admins sichtbar */}
      {isAdmin && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10" style={{ width: 'calc(100% - 2rem)', maxWidth: '800px', justifyContent: 'center' }}>
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-all flex items-center space-x-2"
          >
            <FaPlus />
            <span>Post erstellen</span>
          </button>
          <button
            onClick={() => setIsSubjectFormVisible(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center space-x-2"
          >
            <FaPlus />
            <span>Fach erstellen</span>
          </button>
        </div>
      )}

      {/* Post Form Modal */}
      <PostForm
        isVisible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingPost(null);
          fetchSubjects();
        }}
        editingPost={editingPost}
        subjects={subjects}
      />

      {/* Subject Form Modal */}
      <SubjectForm
        isVisible={isSubjectFormVisible}
        onClose={() => {
          setIsSubjectFormVisible(false);
          setEditingSubject(null);
          fetchSubjects();
        }}
        editingSubject={editingSubject}
      />
    </div>
  );
}

export default Subjects;
