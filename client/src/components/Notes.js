import React, { useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <aside
    className={`bg-black border-r border-purple-600 flex flex-col justify-between transition-all duration-300 ${
      isOpen ? "w-56 p-4" : "w-16 p-2"
    }`}
  >
    <div>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-purple-400 hover:text-white mb-4 text-xl w-full flex justify-center"
      >
        {isOpen ? "×" : "≡"}
      </button>

      {/* Search (only visible when open) */}
      {isOpen && (
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-black text-purple-400 border border-purple-600 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-600 mb-4"
        />
      )}

      {/* Menu */}
      <nav
        className={`flex flex-col gap-4 text-purple-400 ${
          !isOpen && "items-center"
        }`}
      >
        <button className="hover:text-white transition flex items-center justify-start">
          {isOpen ? "Categories / Folders" : "📂"}
        </button>
        <button className="hover:text-white transition flex items-center justify-start">
          {isOpen ? "Docs" : "📄"}
        </button>
        <button className="hover:text-white transition flex items-center justify-start">
          {isOpen ? "Ideas" : "💡"}
        </button>
        <button className="hover:text-white transition flex items-center justify-start">
          {isOpen ? "Snippets" : "✂️"}
        </button>
      </nav>
    </div>

    {/* Add Button */}
    <div className="flex justify-center">
      <button className="w-12 h-12 rounded-full border-2 border-purple-600 text-purple-400 flex items-center justify-center hover:bg-purple-600 hover:text-black transition-transform duration-300 hover:scale-110">
        +
      </button>
    </div>
  </aside>
);

const NoteCard = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="relative w-full max-w-xs aspect-square cursor-pointer group transform transition-transform duration-300 hover:scale-105"
  >
    {/* Neon shadow */}
    <div className="absolute top-1 left-1 w-full h-full bg-purple-600 rounded-2xl transition-all duration-300 group-hover:top-2 group-hover:left-2 group-hover:blur-md group-hover:opacity-80"></div>

    {/* Foreground card */}
    <div className="relative w-full h-full bg-black border border-purple-600 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:border-purple-400 group-hover:shadow-lg group-hover:shadow-purple-600/40 p-4">
      <h3 className="text-purple-400 text-lg font-semibold group-hover:text-white text-center">
        {title}
      </h3>
    </div>
  </div>
);

export default function Notes() {
  const [isOpen, setIsOpen] = useState(true);

  const handleCardClick = (title) => {
    alert(`Opening: ${title}`);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto">
        <NoteCard title="Docs" onClick={() => handleCardClick("Docs")} />
        <NoteCard title="Ideas" onClick={() => handleCardClick("Ideas")} />
        <NoteCard title="Snippets" onClick={() => handleCardClick("Snippets")} />
        <NoteCard title="UI Notes" onClick={() => handleCardClick("UI Notes")} />
        <NoteCard title="Backend Notes" onClick={() => handleCardClick("Backend Notes")} />
        <NoteCard title="Random" onClick={() => handleCardClick("Random")} />
        <NoteCard title="Meeting Notes" onClick={() => handleCardClick("Meeting Notes")} />
        <NoteCard title="Tutorials" onClick={() => handleCardClick("Tutorials")} />
      </main>
    </div>
  );
}