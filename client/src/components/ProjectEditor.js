import { useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";

export default function ProjectEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
  const query = new URLSearchParams(location.search);
  const projectId = query.get("projectId");

  // State management
  const [files, setFiles] = useState([
    { id: 1, name: "index.js", language: "javascript", content: "// Start coding...\nconsole.log('Hello World!');" },
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  
  // Output window state
  const [showOutput, setShowOutput] = useState(true);
  const [outputHeight, setOutputHeight] = useState(250);
  const [output, setOutput] = useState([]);
  const [isResizing, setIsResizing] = useState(false);

  // Load project from localStorage
  useEffect(() => {
    if (projectId) {
      const savedProject = localStorage.getItem(`project-${projectId}`);
      if (savedProject) {
        const projectData = JSON.parse(savedProject);
        if (projectData.files) {
          setFiles(projectData.files);
          setActiveFileId(projectData.activeFileId || projectData.files[0]?.id);
        }
      }
    }
  }, [projectId]);

  // Auto-save project
  useEffect(() => {
    if (projectId && files.length > 0) {
      const saveTimer = setTimeout(() => {
        localStorage.setItem(`project-${projectId}`, JSON.stringify({
          files,
          activeFileId,
          lastSaved: new Date().toISOString()
        }));
      }, 1000);

      return () => clearTimeout(saveTimer);
    }
  }, [files, activeFileId, projectId]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const newHeight = window.innerHeight - e.clientY;
        setOutputHeight(Math.max(100, Math.min(600, newHeight)));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorChange = (value) => {
    setFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, content: value } : file
    ));
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const addNewFile = () => {
    if (!newFileName.trim()) return;

    const extension = newFileName.split('.').pop();
    const languageMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      json: 'json',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
    };

    const newFile = {
      id: Date.now(),
      name: newFileName,
      language: languageMap[extension] || 'plaintext',
      content: `// ${newFileName}\n`
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setNewFileName("");
    setShowNewFileModal(false);
  };

  const deleteFile = (fileId) => {
    if (files.length === 1) {
      alert("Cannot delete the last file!");
      return;
    }
    
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    
    if (activeFileId === fileId) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const downloadFile = () => {
    if (!activeFile) return;
    
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addOutput = (message, type = 'log') => {
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => [...prev, { message, type, timestamp, id: Date.now() }]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const runCode = () => {
    if (!activeFile) return;

    clearOutput();
    addOutput(`Running ${activeFile.name}...`, 'info');

    if (activeFile.language === 'javascript') {
      try {
        // Capture console methods
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
          addOutput(args.join(' '), 'log');
          originalLog(...args);
        };

        console.error = (...args) => {
          addOutput(args.join(' '), 'error');
          originalError(...args);
        };

        console.warn = (...args) => {
          addOutput(args.join(' '), 'warn');
          originalWarn(...args);
        };

        // Execute code
        const result = eval(activeFile.content);
        
        if (result !== undefined) {
          addOutput(`Return value: ${JSON.stringify(result)}`, 'success');
        }

        // Restore console
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        addOutput('✓ Execution completed', 'success');
      } catch (error) {
        addOutput(`Error: ${error.message}`, 'error');
        console.error('Execution error:', error);
      }
    } else if (activeFile.language === 'html') {
      // For HTML, show in output
      addOutput('HTML Preview:', 'info');
      addOutput(activeFile.content, 'html');
    } else {
      addOutput(`Run feature not available for ${activeFile.language} files`, 'warn');
    }

    setShowOutput(true);
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      case 'html': return 'text-purple-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-purple-500 px-4 py-2 flex items-center justify-between mt-16">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
          >
            ← Back to Projects
          </button>
          <span className="text-gray-500">|</span>
          <span className="text-purple-400">Project: {projectId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
            title="Run Code"
          >
            ▶ Run
          </button>
          
          <button
            onClick={() => setShowOutput(!showOutput)}
            className={`${showOutput ? 'bg-purple-600' : 'bg-gray-700'} hover:bg-purple-700 text-white px-4 py-1 rounded text-sm`}
          >
            {showOutput ? '📊 Hide Output' : '📊 Show Output'}
          </button>

          <button
            onClick={downloadFile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
          >
            ⬇ Download
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm"
          >
            ⚙ Settings
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-purple-500 px-4 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Font Size:</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min="10"
              max="30"
              className="bg-gray-700 text-white px-3 py-1 rounded text-sm w-16"
            />
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-purple-500 overflow-y-auto">
          <div className="p-3 border-b border-purple-500 flex items-center justify-between">
            <span className="text-purple-400 font-semibold">FILES</span>
            <button
              onClick={() => setShowNewFileModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
            >
              + New
            </button>
          </div>

          <div className="p-2">
            {files.map(file => (
              <div
                key={file.id}
                className={`group flex items-center justify-between px-3 py-2 rounded cursor-pointer mb-1 ${
                  file.id === activeFileId 
                    ? 'bg-purple-700 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <span className="text-sm truncate flex-1">{file.name}</span>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor and Output */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1 flex flex-col" style={{ height: showOutput ? `calc(100% - ${outputHeight}px)` : '100%' }}>
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <span className="text-purple-400 text-sm font-mono">{activeFile?.name}</span>
            </div>
            
            <Editor
              height="100%"
              theme={theme}
              language={activeFile?.language}
              value={activeFile?.content}
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              options={{
                fontSize,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* Output Window */}
          {showOutput && (
            <div 
              className="border-t-2 border-purple-500 bg-gray-950 flex flex-col"
              style={{ height: `${outputHeight}px` }}
            >
              {/* Resize Handle */}
              <div
                className="h-1 bg-purple-500 hover:bg-purple-400 cursor-ns-resize"
                onMouseDown={() => setIsResizing(true)}
              />

              {/* Output Header */}
              <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <span className="text-purple-400 font-semibold text-sm">OUTPUT</span>
                <div className="flex gap-2">
                  <button
                    onClick={clearOutput}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-800"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowOutput(false)}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-800"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Output Content */}
              <div className="flex-1 overflow-y-auto p-3 font-mono text-sm">
                {output.length === 0 ? (
                  <div className="text-gray-500 text-center mt-8">
                    Click "Run" to execute your code
                  </div>
                ) : (
                  output.map((item) => (
                    <div key={item.id} className="mb-2">
                      <span className="text-gray-500 text-xs mr-2">[{item.timestamp}]</span>
                      <span className={getOutputColor(item.type)}>
                        {item.type === 'html' ? (
                          <div dangerouslySetInnerHTML={{ __html: item.message }} />
                        ) : (
                          item.message
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-500 p-6 rounded-lg w-96">
            <h2 className="text-lg text-purple-400 mb-4">Create New File</h2>
            
            <input
              type="text"
              placeholder="filename.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNewFile()}
              className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewFileModal(false);
                  setNewFileName("");
                }}
                className="px-4 py-2 border border-purple-400 text-purple-300 rounded-md"
              >
                Cancel
              </button>
              
              <button
                onClick={addNewFile}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}