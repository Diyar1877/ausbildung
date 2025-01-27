import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import FavoriteButton from '../components/FavoriteButton';

export default function PostView() {
  const { subjectId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPost();
  }, [subjectId, postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const subjects = await api.getSubjects();
      const subject = subjects.find(s => s.name === subjectId);
      if (!subject) throw new Error('Fach nicht gefunden');
      
      const post = subject.posts.find(p => p.id === postId);
      if (!post) throw new Error('Post nicht gefunden');
      
      setPost({ ...post, subject: subject.name });
    } catch (err) {
      setError(err.message);
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Lade Post...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post nicht gefunden</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-32">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-sm font-medium text-blue-600">
              {post.subject}
            </span>
            <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
            <span className="text-sm text-gray-500 mt-2 block">
              {post.date}
            </span>
          </div>
          <FavoriteButton postId={post.id} subject={post.subject} />
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>
    </div>
  );
}
