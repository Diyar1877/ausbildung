const API_URL = 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

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
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/subjects`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch subjects');
  }
  return response.json();
};

export const createPost = async (subjectId, postData) => {
  const token = localStorage.getItem('token');
  console.log('Creating post for subject:', subjectId);
  console.log('Post data:', postData);
  
  const response = await fetch(`${API_URL}/subjects/${subjectId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create post');
  }
  
  return response.json();
};

export const getPosts = async (subjectId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/subjects/${subjectId}/posts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch posts');
  }
  
  return response.json();
};

// Post bearbeiten
export const updatePost = async (subjectId, postId, postData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/subjects/${subjectId}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update post');
  }
  
  return response.json();
};

// Post löschen
export const deletePost = async (subjectId, postId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/subjects/${subjectId}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete post');
  }
  
  return response.json();
};

// Bild zu Post hinzufügen
export const uploadPostImage = async (subjectId, postId, imageFile) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_URL}/subjects/${subjectId}/posts/${postId}/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }
  
  return response.json();
};

export const createSubject = async (subjectData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(subjectData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error('Fehler beim Erstellen des Fachs');
    }

    return await response.json();
  } catch (error) {
    console.error('Create subject error:', error);
    throw new Error('Fehler beim Erstellen des Fachs');
  }
};

export const updateSubject = async (subjectId, subjectData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(subjectData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error('Fehler beim Aktualisieren des Fachs');
    }

    return await response.json();
  } catch (error) {
    console.error('Update subject error:', error);
    throw new Error('Fehler beim Aktualisieren des Fachs');
  }
};

export const deleteSubject = async (subjectId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error('Fehler beim Löschen des Fachs');
    }

    return true;
  } catch (error) {
    console.error('Delete subject error:', error);
    throw new Error('Fehler beim Löschen des Fachs');
  }
};
