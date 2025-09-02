import React, { useState } from 'react';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const projects = [
    {
      id: 1,
      name: 'Project 1',
      description: 'Description . . .'
    },
    {
      id: 2,
      name: 'Project 2',
      description: 'Description . . .'
    },
    {
      id: 3,
      name: 'Project 3',
      description: 'Description . . .'
    }
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Logo and Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <h1 className="text-purple-500 text-xl sm:text-2xl font-thin tracking-widest">
              DEV VAULT
            </h1>
            
            {/* Navigation */}
            <nav className="flex gap-4 sm:gap-8">
              <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base">
                NOTES
              </button>
              <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base">
                PASSWORDS
              </button>
            </nav>
          </div>
          
          {/* User Icon */}
          <div className="flex justify-end sm:justify-start">
            <button className="text-purple-500 hover:text-purple-400 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar and New Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Find a Project"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-2 border-purple-500 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors text-sm sm:text-base"
            />
          </div>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base min-w-[80px]">
            NEW
          </button>
        </div>

        {/* Projects List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border-2 border-purple-500 rounded-lg p-4 sm:p-6 hover:border-purple-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-purple-400 text-lg sm:text-xl font-medium mb-3 sm:mb-4 break-words">
                    {project.name}
                  </h2>
                  <p className="text-purple-300 text-sm sm:text-base break-words">
                    {project.description}
                  </p>
                </div>
                
                {/* Edit Button */}
                <div className="flex justify-end sm:justify-start">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap min-w-[60px] sm:min-w-[80px]">
                    EDIT
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* No Projects Message */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-purple-300 text-base sm:text-lg">
                {searchTerm ? 'No projects found matching your search.' : 'No projects yet.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;