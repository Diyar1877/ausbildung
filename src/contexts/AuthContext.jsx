import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      // Für Testzwecke
      if (email === 'admin@example.com' && password === 'admin') {
        const adminUser = {
          name: 'Admin',
          email: email,
          isAdmin: true
        };
        setUser(adminUser);
        console.log('Logged in as admin:', adminUser); // Debug-Log
        return true;
      } else {
        const regularUser = {
          name: 'User',
          email: email,
          isAdmin: false
        };
        setUser(regularUser);
        console.log('Logged in as regular user:', regularUser); // Debug-Log
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
      setUser(newUser);
      console.log('Registered new user:', newUser); // Debug-Log
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    console.log('User logged out'); // Debug-Log
  };

  console.log('Current user state:', user); // Debug-Log

  const value = {
    user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
