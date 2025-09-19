import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Sidebar = ({ isOpen, toggleSidebar, categories, onCategorySelect, activeCategory }) => (
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
          placeholder="Search notes..."
          className="w-full bg-black text-purple-400 border border-purple-600 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-600 mb-4"
        />
      )}

      {/* Categories */}
      <nav className={`flex flex-col gap-2 text-purple-400 ${!isOpen && "items-center"}`}>
        <button
          onClick={() => onCategorySelect('all')}
          className={`hover:text-white transition flex items-center justify-start p-2 rounded ${
            activeCategory === 'all' ? 'bg-purple-600 text-white' : ''
          }`}
        >
          {isOpen ? "All Notes" : "📄"}
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`hover:text-white transition flex items-center justify-start p-2 rounded ${
              activeCategory === category.id ? 'bg-purple-600 text-white' : ''
            }`}
          >
            {isOpen ? category.name : category.icon}
          </button>
        ))}
      </nav>
    </div>

    
  </aside>
);

const NoteCard = ({ note, onClick, onEdit, onDelete }) => (
  <div className="relative w-full max-w-xs aspect-square cursor-pointer group transform transition-transform duration-300 hover:scale-105">
    {/* Neon shadow */}
    <div className="absolute top-1 left-1 w-full h-full bg-purple-600 rounded-2xl transition-all duration-300 group-hover:top-2 group-hover:left-2 group-hover:blur-md group-hover:opacity-80"></div>

    {/* Foreground card */}
    <div
      onClick={() => onClick(note)}
      className="relative w-full h-full bg-black border border-purple-600 rounded-2xl flex flex-col justify-between transition-colors duration-300 group-hover:border-purple-400 group-hover:shadow-lg group-hover:shadow-purple-600/40 p-4"
    >
      {/* Card actions */}
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          className="text-xs text-purple-400 hover:text-white"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="text-xs text-purple-400 hover:text-red-400"
        >
          🗑️
        </button>
      </div>

      {/* Card content */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-purple-400 text-lg font-semibold group-hover:text-white text-center mb-2">
          {note.title}
        </h3>
        {note.preview && (
          <p className="text-purple-300 text-xs text-center opacity-70 line-clamp-3">
            {note.preview}
          </p>
        )}
      </div>

      {/* Card footer */}
      <div className="text-xs text-purple-500 text-center">
        {new Date(note.updatedAt).toLocaleDateString()}
      </div>
    </div>
  </div>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black border border-purple-600 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-purple-600">
          <h2 className="text-purple-400 text-lg font-semibold">{title}</h2>
        </div>
        
        <div className="p-4">
          <p className="text-white">{message}</p>
        </div>
        
        <div className="p-4 border-t border-purple-600 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-purple-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const NoteModal = ({ note, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('docs');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setCategory(note.category || 'docs');
    } else {
      setTitle('');
      setContent('');
      setCategory('docs');
    }
  }, [note]);

  const handleSave = () => {
    onSave({
      id: note?.id || Date.now(),
      title: title || 'Untitled',
      content,
      category,
      preview: content.substring(0, 100),
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black border border-purple-600 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-purple-600 flex justify-between items-center">
          <h2 className="text-purple-400 text-lg font-semibold">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <button onClick={onClose} className="text-purple-400 hover:text-white">
            ×
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black text-white border border-purple-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-600"
          />
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-black text-purple-400 border border-purple-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="docs">Docs</option>
            <option value="ideas">Ideas</option>
            <option value="snippets">Snippets</option>
            <option value="ui">UI Notes</option>
            <option value="backend">Backend Notes</option>
            <option value="random">Random</option>
          </select>
          
          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="w-full bg-black text-white border border-purple-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-600 resize-none"
          />
        </div>
        
        <div className="p-4 border-t border-purple-600 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-purple-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Notes() {
  const [isOpen, setIsOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalNote, setModalNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, noteId: null });

  const categories = [
    { id: 'docs', name: 'Docs', icon: '📄' },
    { id: 'ideas', name: 'Ideas', icon: '💡' },
    { id: 'snippets', name: 'Snippets', icon: '✂️' },
    { id: 'ui', name: 'UI Notes', icon: '🎨' },
    { id: 'backend', name: 'Backend Notes', icon: '⚙️' },
    { id: 'random', name: 'Random', icon: '🎲' },
  ];

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes-app-data');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes-app-data', JSON.stringify(notes));
    filterNotes();
  }, [notes, activeCategory]);

  const filterNotes = () => {
    if (activeCategory === 'all') {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(notes.filter(note => note.category === activeCategory));
    }
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleCardClick = (note) => {
    setModalNote(note);
    setIsModalOpen(true);
  };

  const handleNewNote = () => {
    setModalNote(null);
    setIsModalOpen(true);
  };

  const handleSaveNote = (noteData) => {
    if (noteData.id && notes.find(n => n.id === noteData.id)) {
      // Update existing note
      setNotes(notes.map(n => n.id === noteData.id ? noteData : n));
    } else {
      // Add new note
      setNotes([noteData, ...notes]);
    }
  };

  const handleDeleteNote = (noteId) => {
    setConfirmModal({ isOpen: true, noteId });
  };

  const confirmDelete = () => {
    setNotes(notes.filter(n => n.id !== confirmModal.noteId));
    setConfirmModal({ isOpen: false, noteId: null });
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, noteId: null });
  };

  const handleEditNote = (note) => {
    setModalNote(note);
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-black text-white pt-20">
        {/* Sidebar */}
        <Sidebar
          isOpen={isOpen}
          toggleSidebar={() => setIsOpen(!isOpen)}
          categories={categories}
          onCategorySelect={handleCategorySelect}
          activeCategory={activeCategory}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-400">
              {activeCategory === 'all' ? 'All Notes' : 
               categories.find(c => c.id === activeCategory)?.name || 'Notes'}
            </h1>
            <button
              onClick={handleNewNote}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition"
            >
              + New Note
            </button>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center text-purple-400 mt-12">
              <p className="text-xl mb-4">No notes yet</p>
              <button
                onClick={handleNewNote}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition"
              >
                Create your first note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={handleCardClick}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </main>

        {/* Modal */}
        <NoteModal
          note={modalNote}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveNote}
        />

        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
        />
      </div>
    </>
  );
}