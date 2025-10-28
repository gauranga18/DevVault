// hooks/useProjects.js
import { useState, useEffect } from 'react';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = async (projectData) => {
    const newProject = {
      ...projectData,
      id: projectData.id || `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return {
    projects,
    loading,
    error,
    addProject,
    deleteProject,
  };
};