import React, { useState, useRef } from 'react';
import Navbar from './Navbar';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { projects, loading, error, addProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    // Generate a local ID immediately
    const localId = `project-${Date.now()}`;

    try {
      // Try to use the hook's addProject if it exists
      await addProject({
        id: localId,
        name: newProject.name,
        description: newProject.description,
      });
    } catch (error) {
      console.log('Backend not available, using local mode:', error);
    }

    // Always navigate regardless of backend success/failure
    setShowModal(false);
    setNewProject({ name: '', description: '' });
    navigate(`/editor?projectId=${localId}`);
  };

  const handleEdit = (project) => {
    const projectId = project.id || project._id || `project-${Date.now()}`;
    navigate(`/editor?projectId=${projectId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="px-4 py-6 pt-24 max-w-4xl mx-auto">
        
        {/* Search + New Button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 relative">
          <input
            type="text"
            placeholder="Find a Project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border border-purple-500 rounded-md px-3 py-2"
          />

          <div className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
            >
              NEW
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-black border border-purple-600 z-10">
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowModal(true);
                  }}
                  className="block w-full px-4 py-2 text-sm text-purple-300 hover:bg-purple-700 text-left"
                >
                  Create New
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="block w-full px-4 py-2 text-sm text-purple-300 hover:bg-purple-700 text-left"
                >
                  Import from PC
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".zip,.rar,.7z,.json,.txt"
          />
        </div>

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
            <div className="bg-gray-900 border border-purple-500 p-6 rounded-lg w-96">
              <h2 className="text-lg text-purple-400 mb-4">Create New Project</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  required
                />

                <textarea
                  placeholder="Project Description"
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-purple-400 text-purple-300 rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects List */}
        {loading && <p className="text-center text-purple-300">Loading projects...</p>}
        {error && <p className="text-center text-red-400">Error: {error}</p>}
        
        {!loading && filteredProjects.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No projects yet. Click "NEW" to create your first project!
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project._id}
              className="bg-gray-900 border border-purple-500 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => handleEdit(project)}
            >
              <h3 className="text-purple-400 font-semibold">{project.name}</h3>
              {project.description && (
                <p className="text-gray-400 text-sm mt-2">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;