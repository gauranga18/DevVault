import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { 
  createProject, 
  getUserProjects, 
  updateProject, 
  deleteProject 
} from '../firebase/projectsService';

export const useProjects = () => {
  const { user, isAuthenticated } = useAuth0();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) loadProjects();
    else {
      setProjects([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const userProjects = await getUserProjects(user.sub);
      setProjects(userProjects);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    if (!isAuthenticated) throw new Error("Not logged in");
    const newProject = await createProject(user.sub, projectData);
    setProjects(prev => [newProject, ...prev]);
  };

  const editProject = async (projectId, updates) => {
    await updateProject(projectId, updates);
    setProjects(prev =>
      prev.map(p => p.id === projectId ? { ...p, ...updates } : p)
    );
  };

  const removeProject = async (projectId) => {
    await deleteProject(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return {
    projects,
    loading,
    error,
    addProject,
    editProject,
    deleteProject: removeProject,
  };
};
