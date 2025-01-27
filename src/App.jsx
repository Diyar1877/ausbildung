import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tutorials from './pages/Tutorials';
import Projects from './pages/Projects';
import About from './pages/About';
import PostDetail from './pages/PostDetail';
import SubjectPosts from './pages/SubjectPosts';
import Post from './pages/Post';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Subjects from './pages/Subjects';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow mb-15">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/subject/:subject" element={<SubjectPosts />} />
            <Route path="/subject/:subject/post/:id" element={<Post />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/subjects" element={<Subjects />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
