import { useState } from 'react';
import { initialPosts } from '../data/posts';

export const usePosts = () => {
  const [posts, setPosts] = useState(initialPosts);

  const addPost = (newPost) => {
    setPosts(currentPosts => [
      {
        id: currentPosts.length + 1,
        date: new Date().toLocaleDateString('de-DE'),
        ...newPost
      },
      ...currentPosts
    ]);
  };

  const searchPosts = (query) => {
    if (!query) return posts;
    
    const lowercaseQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.subject.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    posts,
    addPost,
    searchPosts
  };
};
