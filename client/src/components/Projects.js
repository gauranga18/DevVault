import React, { useState, useRef } from 'react';
import Navbar from './Navbar';
import { useProjects } from '../hooks/useProjects';

const Projects = () => {
  const { projects, loading, error, addProject, editProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fileInputRef = useRef(null);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    
    try {
      await addProject({
        name: newProject.name,
        description: newProject.description,
      });
      
      setNewProject({ name: '', description: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
      // You can show a toast notification here
    }
  };

  const handleEdit = async (project) => {
    // Implement your edit logic here
    // For example, you might want to open an edit modal
    console.log('Edit project:', project);
    
    // Example of updating a project:
    // try {
    //   await editProject(project.id, { name: 'Updated Name' });
    // } catch (error) {
    //   console.error('Failed to update project:', error);
    // }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-purple-400">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="px-4 py-6 pt-24 max-w-4xl mx-auto">
        {/* Search + New */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 relative">
          <input
            type="text"
            placeholder="Find a Project . . ."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border border-purple-500 rounded-md px-3 py-2"
          />

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
            >
              NEW
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-black border border-purple-600 z-10">
                <div className="py-1 flex flex-col">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowModal(true);
                    }}
                    className="px-4 py-2 text-left text-sm text-purple-300 hover:bg-purple-700"
                  >
                    Create New
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 text-left text-sm text-purple-300 hover:bg-purple-700"
                  >
                    Import from PC
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".zip,.rar,.7z,.json,.txt"
          />
        </div>

        {/* Project List */}
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="border border-purple-500 rounded-md p-4 flex justify-between"
              >
                <div>
                  <h2 className="text-purple-400">{project.name}</h2>
                  <p className="text-purple-300">{project.description}</p>
                  {project.createdAt && (
                    <p className="text-purple-500 text-sm mt-2">
                      Created: {project.createdAt.toDate?.().toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  EDIT
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-purple-600 rounded-lg">
              <p className="text-purple-300">
                {searchTerm ? 'No projects found.' : 'No projects yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Create Project Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
            <div className="bg-gray-900 border border-purple-500 p-6 rounded-lg w-96">
              <h2 className="text-lg text-purple-400 mb-4">Create New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2"
                  required
                />
                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2"
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
      </main>
    </div>
  );
};

export default Projects;