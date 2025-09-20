import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './components/Home';
import Projects from './components/Projects';
import Notes from './components/Notes';
import Passwords from './components/Passwords';
import Profile from './components/Profile';
import Login from './components/Login'; // Create this component
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Project 1', description: 'Sample project' },
  ]);

  // Function to add a new project
  const addProject = (project) => {
    setProjects([...projects, { id: Date.now(), ...project }]);
  };

  const { user, isAuthenticated, isLoading } = useAuth0();
  
  console.log('Current user:', user);
  console.log('Is authenticated:', isAuthenticated);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <ProtectedRoute>
              <Projects projects={projects} addProject={addProject} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/passwords" 
          element={
            <ProtectedRoute>
              <Passwords />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;