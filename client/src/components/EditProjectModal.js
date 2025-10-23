import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditProjectModal({ isOpen, project, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
    }
  }, [project]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-black border border-purple-600 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-purple-400 text-lg font-semibold">Edit Project</h2>
          <button onClick={onClose} className="text-purple-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black text-white border border-purple-600 rounded-md px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-purple-600"
        />

        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full bg-black text-white border border-purple-600 rounded-md px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-purple-600 resize-none"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-purple-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...project, title, description })}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
