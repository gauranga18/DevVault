import React, { useState } from 'react';
import Navbar from './Navbar'; // Assuming this is your Navbar component

const Projects = ({ projects = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects based on the search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="px-4 py-6 pt-24 max-w-4xl mx-auto">
        {/* Search + New Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
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

        {/* Dynamic Projects List or Empty State */}
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            // If there are filtered projects, map over and display them
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="border border-purple-500 rounded-md p-4 flex flex-col gap-3 hover:border-purple-400 transition"
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
            ))
          ) : (
            // If no projects match the search or the initial list is empty, show the message
            <div className="text-center py-12 border border-dashed border-purple-600 rounded-lg">
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