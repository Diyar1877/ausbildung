import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Profil</h1>
        
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name:</label>
            <p className="mt-1">{user?.name || 'Nicht verfügbar'}</p>
          </div>
          
          <div>
            <label className="font-semibold">E-Mail:</label>
            <p className="mt-1">{user?.email || 'Nicht verfügbar'}</p>
          </div>
          
          <div>
            <label className="font-semibold">Rolle:</label>
            <p className="mt-1">{user?.role === 'admin' ? 'Administrator' : 'Benutzer'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 