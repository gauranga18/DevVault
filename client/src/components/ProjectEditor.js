import { useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { 
  Save, 
  PlayCircle, 
  FileText, 
  Settings, 
  Download, 
  Upload,
  Terminal,
  Search,
  Replace,
  Copy,
  Clipboard,
  Maximize2,
  Minimize2,
  FileCode,
  FolderOpen,
  Clock,
  Trash2,
  BookOpen,
  Share2,
  History,
  Code2
} from "lucide-react";

export default function ProjectEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const fileInputRef = useRef(null);
  
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
  
  // Advanced features state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [executionTimeout, setExecutionTimeout] = useState(5000);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);

  // Code snippets
  const snippets = {
    javascript: {
      'for-loop': 'for (let i = 0; i < array.length; i++) {\n  console.log(array[i]);\n}',
      'arrow-function': 'const functionName = (params) => {\n  // code here\n};',
      'async-function': 'async function functionName() {\n  try {\n    const result = await promise;\n    return result;\n  } catch (error) {\n    console.error(error);\n  }\n}',
      'promise': 'const promise = new Promise((resolve, reject) => {\n  // async operation\n  if (success) {\n    resolve(result);\n  } else {\n    reject(error);\n  }\n});',
      'fetch-api': 'fetch(url)\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));',
      'class': 'class ClassName {\n  constructor() {\n    // initialize\n  }\n\n  method() {\n    // code here\n  }\n}',
      'try-catch': 'try {\n  // code that may throw error\n} catch (error) {\n  console.error(error);\n} finally {\n  // cleanup\n}',
      'setTimeout': 'setTimeout(() => {\n  // code to execute\n}, 1000);',
      'addEventListener': 'element.addEventListener("click", (event) => {\n  // handle event\n});',
    },
    html: {
      'html5-template': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>',
      'div': '<div class="container">\n  \n</div>',
      'form': '<form action="" method="POST">\n  <input type="text" name="" id="">\n  <button type="submit">Submit</button>\n</form>',
      'link': '<a href="" target="_blank"></a>',
      'img': '<img src="" alt="">',
    },
    css: {
      'flex-center': '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
      'grid': '.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}',
      'animation': '@keyframes animationName {\n  0% {\n    transform: translateX(0);\n  }\n  100% {\n    transform: translateX(100px);\n  }\n}',
      'media-query': '@media (max-width: 768px) {\n  /* mobile styles */\n}',
    },
    python: {
      'function': 'def function_name(params):\n    """Docstring"""\n    # code here\n    return result',
      'class': 'class ClassName:\n    def __init__(self, params):\n        self.params = params\n    \n    def method(self):\n        # code here\n        pass',
      'for-loop': 'for item in iterable:\n    print(item)',
      'try-except': 'try:\n    # code that may raise exception\n    pass\nexcept Exception as e:\n    print(f"Error: {e}")',
      'list-comprehension': 'result = [x for x in iterable if condition]',
    }
  };

  // Load project from localStorage with error handling
  useEffect(() => {
    if (projectId) {
      try {
        const savedProject = localStorage.getItem(`project-${projectId}`);
        if (savedProject) {
          const projectData = JSON.parse(savedProject);
          if (projectData.files && Array.isArray(projectData.files)) {
            setFiles(projectData.files);
            setActiveFileId(projectData.activeFileId || projectData.files[0]?.id);
            setLastSaved(projectData.lastSaved);
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
        addOutput('Error loading project. Starting with default file.', 'error');
      }
    }
  }, [projectId]);

  // Auto-save project with error handling
  useEffect(() => {
    if (projectId && files.length > 0 && autoSave) {
      const saveTimer = setTimeout(() => {
        try {
          const saveTime = new Date().toISOString();
          localStorage.setItem(`project-${projectId}`, JSON.stringify({
            files,
            activeFileId,
            lastSaved: saveTime,
          }));
          setLastSaved(saveTime);
        } catch (error) {
          console.error('Error saving project:', error);
          addOutput('Error auto-saving project', 'error');
        }
      }, 1000);

      return () => clearTimeout(saveTimer);
    }
  }, [files, activeFileId, projectId, autoSave]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        manualSave();
      }
      // Ctrl/Cmd + R: Run
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        runCode();
      }
      // Ctrl/Cmd + N: New File
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowNewFileModal(true);
      }
      // F11: Fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setShowNewFileModal(false);
        setShowShortcuts(false);
        setShowSnippets(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const newHeight = window.innerHeight - e.clientY - (isFullscreen ? 0 : 64);
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
  }, [isResizing, isFullscreen]);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorChange = (value) => {
    setFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, content: value } : file
    ));
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Add custom keyboard shortcuts to editor
    try {
      editor.addAction({
        id: 'run-code',
        label: 'Run Code',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR],
        run: () => runCode()
      });

      editor.addAction({
        id: 'save-project',
        label: 'Save Project',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
        run: () => manualSave()
      });
    } catch (error) {
      console.error('Error adding editor actions:', error);
    }
  };

  const manualSave = () => {
    if (projectId) {
      try {
        const saveTime = new Date().toISOString();
        localStorage.setItem(`project-${projectId}`, JSON.stringify({
          files,
          activeFileId,
          lastSaved: saveTime,
        }));
        setLastSaved(saveTime);
        addOutput('✓ Project saved successfully', 'success');
      } catch (error) {
        console.error('Error saving:', error);
        addOutput('✗ Error saving project', 'error');
      }
    }
  };

  const addNewFile = () => {
    if (!newFileName.trim()) {
      addOutput('Please enter a file name', 'warn');
      return;
    }

    const extension = newFileName.split('.').pop()?.toLowerCase();
    const languageMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
      json: 'json',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rs: 'rust',
      php: 'php',
      rb: 'ruby',
      md: 'markdown',
      xml: 'xml',
      sql: 'sql',
      sh: 'shell',
    };

    const language = languageMap[extension] || 'plaintext';
    const defaultContent = language === 'html' 
      ? '<!DOCTYPE html>\n<html>\n<head>\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>'
      : `// ${newFileName}\n`;

    const newFile = {
      id: Date.now(),
      name: newFileName,
      language,
      content: defaultContent
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setNewFileName("");
    setShowNewFileModal(false);
    addOutput(`Created ${newFileName}`, 'success');
  };

  const deleteFile = (fileId) => {
    if (files.length === 1) {
      addOutput("Cannot delete the last file!", 'error');
      return;
    }
    
    const fileToDelete = files.find(f => f.id === fileId);
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    
    if (activeFileId === fileId) {
      setActiveFileId(newFiles[0].id);
    }
    
    addOutput(`Deleted ${fileToDelete?.name}`, 'info');
  };

  const downloadFile = () => {
    if (!activeFile) return;
    
    try {
      const blob = new Blob([activeFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile.name;
      a.click();
      URL.revokeObjectURL(url);
      addOutput(`Downloaded ${activeFile.name}`, 'success');
    } catch (error) {
      addOutput('Error downloading file', 'error');
    }
  };

  const downloadAllFiles = () => {
    try {
      files.forEach(file => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      });
      addOutput('Downloaded all files', 'success');
    } catch (error) {
      addOutput('Error downloading files', 'error');
    }
  };

  const importFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const extension = file.name.split('.').pop()?.toLowerCase();
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
          md: 'markdown',
        };

        const newFile = {
          id: Date.now(),
          name: file.name,
          language: languageMap[extension] || 'plaintext',
          content: event.target.result
        };

        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        addOutput(`Imported ${file.name}`, 'success');
      } catch (error) {
        addOutput('Error importing file', 'error');
      }
    };
    
    reader.onerror = () => {
      addOutput('Error reading file', 'error');
    };
    
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  const addOutput = (message, type = 'log') => {
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => [...prev, { message, type, timestamp, id: Date.now() }]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const runCode = async () => {
    if (!activeFile || isExecuting) return;

    setIsExecuting(true);
    clearOutput();
    addOutput(`Running ${activeFile.name}...`, 'info');

    if (activeFile.language === 'javascript') {
      // Save original console methods
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;

      const logs = [];
      
      try {
        // Override console methods
        console.log = (...args) => {
          const message = args.map(arg => {
            try {
              return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
            } catch {
              return String(arg);
            }
          }).join(' ');
          logs.push({ message, type: 'log' });
        };

        console.error = (...args) => {
          const message = args.map(arg => String(arg)).join(' ');
          logs.push({ message, type: 'error' });
        };

        console.warn = (...args) => {
          const message = args.map(arg => String(arg)).join(' ');
          logs.push({ message, type: 'warn' });
        };

        console.info = (...args) => {
          const message = args.map(arg => String(arg)).join(' ');
          logs.push({ message, type: 'info' });
        };

        // Execute with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Execution timeout exceeded')), executionTimeout)
        );

        const executionPromise = new Promise((resolve, reject) => {
          try {
            // Wrap code in async function to support await
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            const fn = new AsyncFunction(activeFile.content);
            resolve(fn());
          } catch (error) {
            reject(error);
          }
        });

        const result = await Promise.race([executionPromise, timeoutPromise]);

        // Display all captured logs
        logs.forEach(log => addOutput(log.message, log.type));
        
        if (result !== undefined) {
          try {
            addOutput(`Return value: ${JSON.stringify(result, null, 2)}`, 'success');
          } catch {
            addOutput(`Return value: ${String(result)}`, 'success');
          }
        }

        addOutput('✓ Execution completed successfully', 'success');
      } catch (error) {
        // Display captured logs even on error
        logs.forEach(log => addOutput(log.message, log.type));
        
        addOutput(`✗ Error: ${error.message}`, 'error');
        if (error.stack) {
          const stackLines = error.stack.split('\n').slice(0, 5);
          stackLines.forEach(line => {
            if (line.trim()) addOutput(line.trim(), 'error');
          });
        }
      } finally {
        // Always restore console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        console.info = originalInfo;
      }
    } else if (activeFile.language === 'html') {
      addOutput('HTML Preview:', 'info');
      addOutput(activeFile.content, 'html');
      addOutput('✓ HTML rendered', 'success');
    } else if (activeFile.language === 'css') {
      addOutput('CSS code loaded. To preview, use with an HTML file.', 'info');
    } else {
      addOutput(`Execution not available for ${activeFile.language} files.`, 'warn');
      addOutput('This editor currently supports JavaScript and HTML execution.', 'info');
    }

    setIsExecuting(false);
    setShowOutput(true);
  };

  const formatCode = () => {
    if (!editorRef.current) return;
    try {
      editorRef.current.getAction('editor.action.formatDocument').run();
      addOutput('Code formatted', 'success');
    } catch (error) {
      addOutput('Error formatting code', 'error');
    }
  };

  const toggleComment = () => {
    if (!editorRef.current) return;
    try {
      editorRef.current.getAction('editor.action.commentLine').run();
    } catch (error) {
      console.error('Error toggling comment:', error);
    }
  };

  const findInCode = () => {
    if (!editorRef.current) return;
    try {
      editorRef.current.getAction('actions.find').run();
    } catch (error) {
      console.error('Error opening find:', error);
    }
  };

  const replaceInCode = () => {
    if (!editorRef.current) return;
    try {
      editorRef.current.getAction('editor.action.startFindReplaceAction').run();
    } catch (error) {
      console.error('Error opening replace:', error);
    }
  };

  const duplicateFile = (fileId) => {
    const fileToDuplicate = files.find(f => f.id === fileId);
    if (!fileToDuplicate) return;

    const baseName = fileToDuplicate.name.split('.')[0];
    const extension = fileToDuplicate.name.split('.').pop();
    const newFile = {
      ...fileToDuplicate,
      id: Date.now(),
      name: `${baseName}_copy.${extension}`
    };

    setFiles(prev => [...prev, newFile]);
    addOutput(`Duplicated ${fileToDuplicate.name}`, 'success');
  };

  const renameFile = (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const newName = prompt('Enter new name:', file.name);
    if (!newName || newName === file.name) return;

    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, name: newName } : f
    ));
    addOutput(`Renamed to ${newName}`, 'success');
  };

  const copyToClipboard = () => {
    if (!activeFile) return;
    try {
      navigator.clipboard.writeText(activeFile.content);
      addOutput('Code copied to clipboard', 'success');
    } catch (error) {
      addOutput('Error copying to clipboard', 'error');
    }
  };

  const insertSnippet = (snippetCode) => {
    if (!editorRef.current) return;
    try {
      const selection = editorRef.current.getSelection();
      const id = { major: 1, minor: 1 };
      const op = {
        identifier: id,
        range: selection,
        text: snippetCode,
        forceMoveMarkers: true
      };
      editorRef.current.executeEdits("snippet-insert", [op]);
      setShowSnippets(false);
      addOutput('Snippet inserted', 'success');
    } catch (error) {
      addOutput('Error inserting snippet', 'error');
    }
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

  const getFileIcon = (language) => {
    const icons = {
      javascript: '📜',
      typescript: '📘',
      html: '🌐',
      css: '🎨',
      python: '🐍',
      java: '☕',
      json: '📋',
      markdown: '📝',
      cpp: '⚙️',
      c: '🔧',
      rust: '🦀',
      go: '🐹',
      php: '🐘',
      ruby: '💎',
    };
    return icons[language] || '📄';
  };

  const currentSnippets = snippets[activeFile?.language] || {};

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-black text-white flex flex-col`}>
      {!isFullscreen && <Navbar />}
      
      {/* Top Bar */}
      <div className={`bg-gray-900 border-b border-purple-500 px-4 py-2 flex items-center justify-between ${!isFullscreen && 'mt-16'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm"
          >
            ← Back
          </button>
          <span className="text-gray-500">|</span>
          <span className="text-purple-400 text-sm">Project: {projectId}</span>
          {lastSaved && (
            <>
              <span className="text-gray-500">|</span>
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Clock size={12} />
                {new Date(lastSaved).toLocaleTimeString()}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={manualSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            title="Save (Ctrl+S)"
          >
            <Save size={14} />
            Save
          </button>
          
          <button
            onClick={runCode}
            disabled={isExecuting}
            className={`${isExecuting ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-3 py-1 rounded text-sm flex items-center gap-1`}
            title="Run Code (Ctrl+R)"
          >
            <PlayCircle size={14} />
            {isExecuting ? 'Running...' : 'Run'}
          </button>
          
          <button
            onClick={() => setShowOutput(!showOutput)}
            className={`${showOutput ? 'bg-purple-600' : 'bg-gray-700'} hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1`}
          >
            <Terminal size={14} />
            Output
          </button>

          <button
            onClick={formatCode}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            title="Format Code"
          >
            <FileCode size={14} />
            Format
          </button>

          <button
            onClick={() => setShowSnippets(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            title="Code Snippets"
          >
            <Code2 size={14} />
            Snippets
          </button>

          <button
            onClick={downloadFile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <Download size={14} />
          </button>

          <button
            onClick={importFile}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <Upload size={14} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <Settings size={14} />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            title="Fullscreen (F11)"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button
            onClick={() => setShowShortcuts(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            title="Keyboard Shortcuts"
          >
            ?
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-purple-500 px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex-1"
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
                onChange={(e) => setFontSize(parseInt(e.target.value) || 14)}
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-16"
                min="8"
                max="32"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Execution Timeout (ms):</label>
              <input
                type="number"
                value={executionTimeout}
                onChange={(e) => setExecutionTimeout(parseInt(e.target.value) || 5000)}
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20"
                min="1000"
                max="30000"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSave"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="autoSave" className="text-sm text-gray-300">Auto Save</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wordWrap"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="wordWrap" className="text-sm text-gray-300">Word Wrap</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lineNumbers"
                checked={lineNumbers}
                onChange={(e) => setLineNumbers(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="lineNumbers" className="text-sm text-gray-300">Line Numbers</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="minimap"
                checked={minimap}
                onChange={(e) => setMinimap(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="minimap" className="text-sm text-gray-300">Minimap</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="fileExplorer"
                checked={showFileExplorer}
                onChange={(e) => setShowFileExplorer(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="fileExplorer" className="text-sm text-gray-300">File Explorer</label>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        {showFileExplorer && (
          <div className="w-64 bg-gray-900 border-r border-purple-500 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-purple-400 font-semibold">Files</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setShowNewFileModal(true)}
                    className="text-green-400 hover:text-green-300 p-1"
                    title="New File (Ctrl+N)"
                  >
                    <FileText size={16} />
                  </button>
                  <button
                    onClick={downloadAllFiles}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="Download All Files"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              
              <button
                onClick={importFile}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm flex items-center gap-2 justify-center"
              >
                <FolderOpen size={14} />
                Import File
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`group flex items-center justify-between px-4 py-2 hover:bg-gray-800 cursor-pointer ${
                    activeFileId === file.id ? 'bg-purple-900 border-r-2 border-purple-400' : ''
                  }`}
                  onClick={() => setActiveFileId(file.id)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm">{getFileIcon(file.language)}</span>
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateFile(file.id);
                      }}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="Duplicate"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        renameFile(file.id);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 p-1"
                      title="Rename"
                    >
                      <FileText size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={formatCode}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 justify-center"
                >
                  <FileCode size={12} />
                  Format
                </button>
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 justify-center"
                >
                  <Clipboard size={12} />
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="bg-gray-800 border-b border-purple-500 flex items-center overflow-x-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-2 px-4 py-2 border-r border-gray-700 min-w-0 max-w-48 cursor-pointer ${
                  activeFileId === file.id ? 'bg-gray-900 text-purple-400' : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <span className="text-sm">{getFileIcon(file.language)}</span>
                <span className="text-sm truncate flex-1">{file.name}</span>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowNewFileModal(true)}
              className="px-3 py-2 text-green-400 hover:text-green-300 flex items-center gap-1"
              title="New File (Ctrl+N)"
            >
              <FileText size={16} />
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            {activeFile && (
              <Editor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                theme={theme}
                options={{
                  fontSize,
                  wordWrap: wordWrap ? 'on' : 'off',
                  lineNumbers: lineNumbers ? 'on' : 'off',
                  minimap: { enabled: minimap },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  parameterHints: { enabled: true },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Output Panel */}
      {showOutput && (
        <>
          <div
            className="border-t border-purple-500 bg-gray-900 cursor-ns-resize hover:bg-purple-900 transition-colors"
            onMouseDown={() => setIsResizing(true)}
            style={{ height: '4px' }}
          />
          <div
            className="bg-gray-900 border-t border-purple-500 overflow-hidden"
            style={{ height: `${outputHeight}px` }}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-purple-500">
              <div className="flex items-center gap-4">
                <Terminal size={16} className="text-purple-400" />
                <h3 className="text-purple-400 font-semibold">Output</h3>
                <div className="flex gap-2">
                  <button
                    onClick={clearOutput}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Clear
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <Clipboard size={14} />
                    Copy Output
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Lines: {output.length}</span>
                <button
                  onClick={() => setShowOutput(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <Minimize2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="h-full overflow-y-auto bg-black p-4 font-mono text-sm">
              {output.length === 0 ? (
                <div className="text-gray-500 italic">Output will appear here after running code...</div>
              ) : (
                output.map((item) => (
                  <div key={item.id} className="flex gap-4 hover:bg-gray-900 px-2 py-1">
                    <span className="text-gray-500 text-xs min-w-16">{item.timestamp}</span>
                    <span className={`flex-1 ${getOutputColor(item.type)} whitespace-pre-wrap`}>
                      {item.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-purple-500 w-96">
            <h3 className="text-purple-400 text-lg mb-4">Create New File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.js, index.html, style.css..."
              className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-4"
              onKeyDown={(e) => e.key === 'Enter' && addNewFile()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowNewFileModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={addNewFile}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-purple-500 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-purple-400 text-lg mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-3">
              {[
                { keys: 'Ctrl+S', action: 'Save Project' },
                { keys: 'Ctrl+R', action: 'Run Code' },
                { keys: 'Ctrl+N', action: 'New File' },
                { keys: 'F11', action: 'Toggle Fullscreen' },
                { keys: 'Esc', action: 'Close Modals' },
                { keys: 'Ctrl+/', action: 'Toggle Comment' },
                { keys: 'Ctrl+F', action: 'Find in Code' },
                { keys: 'Ctrl+H', action: 'Find and Replace' },
                { keys: 'Ctrl+Shift+F', action: 'Format Code' },
              ].map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center">
                  <kbd className="bg-gray-700 px-2 py-1 rounded text-sm">{shortcut.keys}</kbd>
                  <span className="text-gray-300">{shortcut.action}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSnippets && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-purple-500 w-2/3 max-h-96 overflow-hidden flex flex-col">
            <h3 className="text-purple-400 text-lg mb-4">Code Snippets - {activeFile?.language}</h3>
            <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto">
              {Object.entries(currentSnippets).map(([name, code]) => (
                <div
                  key={name}
                  className="bg-gray-700 p-4 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => insertSnippet(code)}
                >
                  <div className="text-purple-400 font-semibold mb-2 capitalize">
                    {name.replace('-', ' ')}
                  </div>
                  <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
                    {code}
                  </pre>
                </div>
              ))}
            </div>
            {Object.keys(currentSnippets).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No snippets available for {activeFile?.language}
              </div>
            )}
            <button
              onClick={() => setShowSnippets(false)}
              className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".js,.jsx,.ts,.tsx,.html,.css,.json,.py,.java,.cpp,.c,.md,.txt"
        className="hidden"
      />
    </div>
  );
}