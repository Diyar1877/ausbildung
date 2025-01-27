import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tutorials from './pages/Tutorials';
import Projects from './pages/Projects';
import About from './pages/About';
import PostDetail from './pages/PostDetail';
import SubjectPosts from './pages/SubjectPosts';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Subjects from './pages/Subjects';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import Profile from './pages/Profile';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <main className={`flex-grow ${!user ? 'mb-0' : 'mb-15'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/tutorials" element={
            <ProtectedRoute>
              <Tutorials />
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/subjects" element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          } />
          <Route path="/subjects/:subjectId/posts/:postId" element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          } />
          
          {/* Catch all route - redirect to home if logged in, otherwise to login */}
          <Route path="*" element={
            user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
