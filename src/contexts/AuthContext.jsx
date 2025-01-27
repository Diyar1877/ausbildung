import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Beim Start der App, prüfe ob ein User und Token im localStorage sind
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      // Prüfe ob der Token ein Admin- oder User-Token ist
      const isAdminToken = token.startsWith('admin-mock-token-');
      const userData = JSON.parse(storedUser);
      
      // Stelle sicher, dass der Token-Typ mit dem User-Typ übereinstimmt
      if ((isAdminToken && userData.isAdmin) || (!isAdminToken && !userData.isAdmin)) {
        setUser(userData);
      } else {
        // Bei Unstimmigkeit, lösche die Daten
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Für Testzwecke
      if (email === 'admin@example.com' && password === 'admin') {
        const adminUser = {
          name: 'Admin',
          email: email,
          isAdmin: true
        };
        // Generiere einen Mock-Token für den Admin
        const token = 'admin-mock-token-' + Date.now();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        console.log('Logged in as admin:', adminUser);
        return true;
      } else {
        const regularUser = {
          name: 'User',
          email: email,
          isAdmin: false
        };
        // Generiere einen Mock-Token für reguläre Benutzer
        const token = 'user-mock-token-' + Date.now();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(regularUser));
        setUser(regularUser);
        console.log('Logged in as regular user:', regularUser);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const newUser = {
        name: name,
        email: email,
        isAdmin: false
      };
      // Generiere einen Mock-Token für neue Benutzer
      const token = 'user-mock-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      console.log('Registered new user:', newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('User logged out');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
