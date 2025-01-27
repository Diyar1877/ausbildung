// Post bearbeiten
export const updatePost = async (subjectId, postId, postData) => {
  try {
    const response = await fetch(`${API_URL}/subjects/${subjectId}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Post konnte nicht aktualisiert werden');
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Posts:', error);
    throw error;
  }
};

// Post löschen
export const deletePost = async (subjectId, postId) => {
  try {
    const response = await fetch(`${API_URL}/subjects/${subjectId}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Post konnte nicht gelöscht werden');
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler beim Löschen des Posts:', error);
    throw error;
  }
};

// Bild zu Post hinzufügen
export const uploadPostImage = async (subjectId, postId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/subjects/${subjectId}/posts/${postId}/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Bild konnte nicht hochgeladen werden');
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    throw error;
  }
}; 