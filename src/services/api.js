const API_URL = 'http://localhost:3001';

// Auth API calls
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login fehlgeschlagen');
  }

  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registrierung fehlgeschlagen');
  }

  return response.json();
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Abrufen des Profils');
  }

  return response.json();
};

// Subjects and Posts API calls
export const getSubjects = async () => {
  const response = await fetch(`${API_URL}/subjects`);
  if (!response.ok) {
    throw new Error('Failed to fetch subjects');
  }
  return response.json();
};

export const createPost = async (subjectId, postData) => {
  const response = await fetch(`${API_URL}/subjects/${subjectId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
};

export const getPosts = async (subjectId) => {
  const response = await fetch(`${API_URL}/subjects/${subjectId}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};
