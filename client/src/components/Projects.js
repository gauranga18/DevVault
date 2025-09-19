import React, { useState, useRef } from 'react';
import Navbar from './Navbar'; // Assuming this is your Navbar component

const Projects = ({ projects = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false); // dropdown state
  const fileInputRef = useRef(null); // reference for hidden file input

  // Filter projects based on the search term
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      // TODO: upload file to Firebase Storage
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="px-4 py-6 pt-24 max-w-4xl mx-auto">
        {/* Search + New Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 relative">
          <input
            type="text"
            placeholder="Find a Project . . ."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border border-purple-500 rounded-md px-3 py-2 text-sm sm:text-base placeholder-purple-300 focus:outline-none focus:border-purple-400"
          />

          {/* Dropdown Button */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setOpen(!open)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base"
            >
              NEW
            </button>

            {/* Dropdown options */}
            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-black border border-purple-600 z-10">
                <div className="py-1 flex flex-col">
                  <button
                    onClick={() => {
                      setOpen(false);
                      // TODO: open create project modal
                      console.log("Create New project clicked");
                    }}
                    className="px-4 py-2 text-left text-sm text-purple-300 hover:bg-purple-700 hover:text-white transition-colors"
                  >
                    Create New
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      fileInputRef.current.click(); // trigger hidden file input
                    }}
                    className="px-4 py-2 text-left text-sm text-purple-300 hover:bg-purple-700 hover:text-white transition-colors"
                  >
                    Import from PC
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".zip,.rar,.7z,.json,.txt" // adjust allowed file types
          />
        </div>

        {/* Dynamic Projects List or Empty State */}
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
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
