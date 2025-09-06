import React from "react";

const Sidebar = () => (
  <aside className="w-56 bg-black border-r border-purple-600 flex flex-col justify-between p-4">
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-black text-purple-400 border border-purple-600 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-600"
      />

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-4 text-purple-400">
        <button className="hover:text-white transition">Categories / Folders</button>
        <button className="hover:text-white transition">Docs</button>
        <button className="hover:text-white transition">Ideas</button>
        <button className="hover:text-white transition">Snippets</button>
      </nav>
    </div>

    {/* Add Button */}
    <button className="w-12 h-12 rounded-full border-2 border-purple-600 text-purple-400 flex items-center justify-center hover:bg-purple-600 hover:text-black transition">
      +
    </button>
  </aside>
);

const NoteCard = ({ title }) => (
  <div className="relative w-full h-56">
    {/* Neon shadow */}
    <div className="absolute top-2 left-2 w-full h-full bg-purple-600 rounded-2xl"></div>

    {/* Foreground card */}
    <div className="relative w-full h-full bg-black border border-purple-600 rounded-2xl flex items-center justify-center">
      <h3 className="text-purple-400 text-lg font-semibold">{title}</h3>
    </div>
  </div>
);

export default function Notes() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 overflow-y-auto">
        <NoteCard title="Docs" />
        <NoteCard title="Ideas" />
        <NoteCard title="Snippets" />
        <NoteCard title="UI Notes" />
        <NoteCard title="Backend Notes" />
        <NoteCard title="Random" />
      </main>
    </div>
  );
}
