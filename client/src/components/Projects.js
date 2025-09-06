import React, { useState } from 'react';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const projects = [
    { id: 1, name: 'Project 1', description: 'Description . . .' },
    { id: 2, name: 'Project 2', description: 'Description . . .' },
    { id: 3, name: 'Project 3', description: 'Description . . .' }
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500 px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-6">
            <h1 className="text-purple-500 text-xl sm:text-2xl font-thin tracking-widest">
              DEV VAULT
            </h1>
            <nav className="flex gap-6">
              <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base">
                NOTES
              </button>
              <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base">
                PASSWORDS
              </button>
            </nav>
          </div>

          {/* Right side (User Icon) */}
          <button className="text-purple-500 hover:text-purple-400 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 py-6">
        {/* Search + New */}
        <div className="flex gap-2 sm:gap-4 mb-6">
          <input
            type="text"
            placeholder="Find a Project . . ."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border border-purple-500 rounded-md px-3 py-2 text-sm sm:text-base placeholder-purple-300 focus:outline-none focus:border-purple-400"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base">
            NEW
          </button>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-purple-500 rounded-md p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-purple-400 text-base sm:text-lg font-medium">
                    {project.name}
                  </h2>
                  <p className="text-purple-300 text-sm sm:text-base">
                    {project.description}
                  </p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors text-sm sm:text-base">
                  EDIT
                </button>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-purple-300 text-sm sm:text-base">
                {searchTerm ? 'No projects found.' : 'No projects yet.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
