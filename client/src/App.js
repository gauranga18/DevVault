import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './components/Home';
import Projects from './components/Projects';
import Notes from './components/Notes';
import Passwords from './components/Passwords';
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Project 1', description: 'Sample project' },
  ]);

  // Function to add a new project
  const addProject = (project) => {
    setProjects([...projects, { id: Date.now(), ...project }]);
  };

  const { user, loginWithRedirect, isAuthenticated, logout, isLoading } = useAuth0();
  console.log(user);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="App">
      {/* Example Auth0 header (optional) */}
      {/* 
      <header className="App-header">
        <h3>Hello, {user?.name || "Guest"}</h3>
        {isAuthenticated ? (
          <button onClick={() => logout()}>Logout</button>
        ) : (
          <button onClick={() => loginWithRedirect()}>Login or Signup</button>
        )}
      </header>
      */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Projects" element={<Projects projects={projects} addProject={addProject} />} />
        <Route path="/Passwords" element={<Passwords />} />
        <Route path="/Notes" element={<Notes />} />
      </Routes>
    </div>
  );
}

export default App;
