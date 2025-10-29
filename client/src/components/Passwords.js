import React, { useState, useEffect } from 'react';
import { Search, Plus, Copy, Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Grid, List, Lock, Unlock, RefreshCw, X, Download, Upload, Clock, Key, Settings } from 'lucide-react';
import CryptoJS from 'crypto-js';

// Encryption utilities with PROPER implementation
const encryptPassword = (password, masterPassword) => {
  const salt = CryptoJS.lib.WordArray.random(128/8);
  const key = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 10000
  });
  const encrypted = CryptoJS.AES.encrypt(password, key);
  return { 
    encrypted: encrypted.toString(), 
    salt: salt.toString() 
  };
};

const decryptPassword = (encryptedData, salt, masterPassword) => {
  try {
    const saltWordArray = CryptoJS.enc.Hex.parse(salt);
    const key = CryptoJS.PBKDF2(masterPassword, saltWordArray, {
      keySize: 256/32,
      iterations: 10000
    });
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    return result || null;
  } catch (error) {
    return null;
  }
};

const hashMasterPassword = (password) => {
  // Double hash for extra security: SHA256(SHA256(password) + password)
  const firstHash = CryptoJS.SHA256(password).toString();
  const secondHash = CryptoJS.SHA256(firstHash + password).toString();
  return secondHash;
};

const calculatePasswordStrength = (password) => {
  if (!password) return 'weak';
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  return 'strong';
};

const generateRandomPassword = (length = 16, options = {}) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let charset = '';
  if (options.lowercase !== false) charset += lowercase;
  if (options.uppercase !== false) charset += uppercase;
  if (options.numbers !== false) charset += numbers;
  if (options.symbols !== false) charset += symbols;
  
  // Fallback if all options are disabled
  if (!charset) charset = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  
  return password;
};

// Simple Navbar component
const Navbar = ({ onSettingsClick, isUnlocked }) => (
  <div className="border-b border-purple-600 py-4 px-6">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="text-purple-400" size={24} />
        <h1 className="text-xl font-bold text-white">SecureVault</h1>
      </div>
      {isUnlocked && onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className="text-purple-400 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      )}
    </div>
  </div>
);

function Passwords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [showPassword, setShowPassword] = useState({});
  const [copyFeedback, setCopyFeedback] = useState('');
  
  // Vault state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('');
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [masterPasswordHash, setMasterPasswordHash] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // Auto-lock state
  const [lastActivity, setLastActivity] = useState(Date.now());
  const AUTO_LOCK_TIME = 5 * 60 * 1000; // 5 minutes
  
  // Passwords state
  const [encryptedPasswords, setEncryptedPasswords] = useState([]);
  const [decryptedPasswords, setDecryptedPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGeneratorOptions, setShowGeneratorOptions] = useState(false);
  const [newPasswordEntry, setNewPasswordEntry] = useState({
    website: '',
    url: '',
    username: '',
    password: '',
    category: 'personal',
    favicon: '🔐',
    notes: ''
  });
  const [passwordOptions, setPasswordOptions] = useState({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true
  });

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Check if vault is initialized (master password is set)
      // FIX: Use localStorage as fallback if window.storage doesn't exist
      let hashResult;
      if (typeof window !== 'undefined' && window.storage) {
        hashResult = await window.storage.get('master_password_hash');
      } else {
        // Fallback to localStorage for development
        hashResult = { value: localStorage.getItem('master_password_hash') };
      }
      
      if (hashResult && hashResult.value) {
        setMasterPasswordHash(hashResult.value);
        setIsInitialized(true);
        setIsFirstTime(false);
      } else {
        setIsFirstTime(true);
        setIsInitialized(false);
      }
      
      // Load encrypted passwords
      let passwordsResult;
      if (typeof window !== 'undefined' && window.storage) {
        passwordsResult = await window.storage.get('encrypted_passwords');
      } else {
        // Fallback to localStorage for development
        passwordsResult = { value: localStorage.getItem('encrypted_passwords') };
      }
      
      if (passwordsResult && passwordsResult.value) {
        setEncryptedPasswords(JSON.parse(passwordsResult.value));
      }
    } catch (error) {
      console.log('No existing data found or error loading:', error);
      setIsFirstTime(true);
      setIsInitialized(false);
    } finally {
      setLoading(false);
    }
  };

  const saveEncryptedPasswords = async (passwords) => {
    try {
      if (typeof window !== 'undefined' && window.storage) {
        await window.storage.set('encrypted_passwords', JSON.stringify(passwords));
      } else {
        // Fallback to localStorage for development
        localStorage.setItem('encrypted_passwords', JSON.stringify(passwords));
      }
      return true;
    } catch (error) {
      console.error('Failed to save passwords:', error);
      alert('Failed to save passwords. Please try again.');
      return false;
    }
  };

  // Auto-lock functionality
  useEffect(() => {
    if (!isUnlocked) return;

    const handleActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > AUTO_LOCK_TIME) {
        handleLock();
      }
    }, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [isUnlocked, lastActivity]);

  const handleSetupMasterPassword = async (e) => {
    e.preventDefault();
    
    if (masterPassword.length < 8) {
      alert('Master password must be at least 8 characters long');
      return;
    }
    
    const strength = calculatePasswordStrength(masterPassword);
    if (strength === 'weak') {
      alert('Master password is too weak. Please use a stronger password with uppercase, lowercase, numbers, and symbols.');
      return;
    }
    
    if (masterPassword !== confirmMasterPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Hash the master password for verification
    const hash = hashMasterPassword(masterPassword);
    
    try {
      if (typeof window !== 'undefined' && window.storage) {
        await window.storage.set('master_password_hash', hash);
      } else {
        // Fallback to localStorage for development
        localStorage.setItem('master_password_hash', hash);
      }
      setMasterPasswordHash(hash);
      setIsFirstTime(false);
      setIsInitialized(true);
      setIsUnlocked(true);
      alert('✅ Master password created successfully! Your vault is now protected.');
    } catch (error) {
      alert('Failed to save master password. Please try again.');
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    
    if (!isInitialized || !masterPasswordHash) {
      alert('Vault not initialized. Please refresh the page.');
      return;
    }
    
    // Verify master password
    const hash = hashMasterPassword(masterPassword);
    if (hash !== masterPasswordHash) {
      alert('❌ Invalid master password! Please try again.');
      setMasterPassword('');
      return;
    }

    if (encryptedPasswords.length === 0) {
      setIsUnlocked(true);
      alert('✅ Vault unlocked successfully!');
      return;
    }

    // Try to decrypt all passwords to verify master password is correct
    const decrypted = encryptedPasswords.map(pwd => {
      const decryptedPwd = decryptPassword(pwd.encryptedPassword, pwd.salt, masterPassword);
      if (!decryptedPwd) {
        return null;
      }
      return {
        ...pwd,
        password: decryptedPwd
      };
    });

    // Check if decryption was successful
    if (decrypted.some(p => p === null)) {
      alert('❌ Failed to decrypt passwords. Your master password may have been changed or data is corrupted.');
      setMasterPassword('');
      return;
    }

    setDecryptedPasswords(decrypted);
    setIsUnlocked(true);
    setLastActivity(Date.now());
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setMasterPassword('');
    setConfirmMasterPassword('');
    setDecryptedPasswords([]);
    setShowPassword({});
    setShowAddModal(false);
    setShowSettingsModal(false);
  };

  const handleChangeMasterPassword = async (e) => {
    e.preventDefault();
    
    // Verify old password
    const oldHash = hashMasterPassword(oldPassword);
    if (oldHash !== masterPasswordHash) {
      alert('❌ Current master password is incorrect!');
      return;
    }
    
    // Validate new password
    if (newPassword.length < 8) {
      alert('New master password must be at least 8 characters long');
      return;
    }
    
    const strength = calculatePasswordStrength(newPassword);
    if (strength === 'weak') {
      alert('New master password is too weak. Please use a stronger password.');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (oldPassword === newPassword) {
      alert('New password must be different from the current password!');
      return;
    }

    try {
      // Re-encrypt all passwords with new master password
      const reencryptedPasswords = decryptedPasswords.map(pwd => {
        const { encrypted, salt } = encryptPassword(pwd.password, newPassword);
        return {
          ...pwd,
          encryptedPassword: encrypted,
          salt: salt
        };
      });

      // Save new master password hash
      const newHash = hashMasterPassword(newPassword);
      if (typeof window !== 'undefined' && window.storage) {
        await window.storage.set('master_password_hash', newHash);
      } else {
        localStorage.setItem('master_password_hash', newHash);
      }
      
      // Save re-encrypted passwords
      await saveEncryptedPasswords(reencryptedPasswords);
      
      // Update state
      setMasterPasswordHash(newHash);
      setEncryptedPasswords(reencryptedPasswords);
      setMasterPassword(newPassword);
      
      // Reset form
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowSettingsModal(false);
      
      alert('✅ Master password changed successfully! All passwords have been re-encrypted.');
    } catch (error) {
      alert('❌ Failed to change master password. Please try again.');
    }
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();

    if (!newPasswordEntry.website || !newPasswordEntry.username || !newPasswordEntry.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Check for duplicates
    const duplicate = decryptedPasswords.find(
      p => p.website.toLowerCase() === newPasswordEntry.website.toLowerCase() && 
           p.username.toLowerCase() === newPasswordEntry.username.toLowerCase()
    );
    
    if (duplicate) {
      if (!window.confirm('A password for this website and username already exists. Do you want to add it anyway?')) {
        return;
      }
    }

    // Encrypt the password
    const { encrypted, salt } = encryptPassword(newPasswordEntry.password, masterPassword);
    
    // Calculate strength
    const strength = calculatePasswordStrength(newPasswordEntry.password);

    // Create new password entry
    const newEntry = {
      id: Date.now(),
      website: newPasswordEntry.website,
      url: newPasswordEntry.url,
      username: newPasswordEntry.username,
      encryptedPassword: encrypted,
      salt: salt,
      strength: strength,
      category: newPasswordEntry.category,
      favicon: newPasswordEntry.favicon,
      notes: newPasswordEntry.notes,
      lastUsed: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const updatedEncrypted = [...encryptedPasswords, newEntry];
    const saved = await saveEncryptedPasswords(updatedEncrypted);
    
    if (!saved) return;
    
    setEncryptedPasswords(updatedEncrypted);

    // Add to decrypted passwords (current session)
    setDecryptedPasswords(prev => [...prev, {
      ...newEntry,
      password: newPasswordEntry.password
    }]);

    // Reset form
    setShowAddModal(false);
    setNewPasswordEntry({
      website: '',
      url: '',
      username: '',
      password: '',
      category: 'personal',
      favicon: '🔐',
      notes: ''
    });
  };

  const handleDelete = async (passwordId) => {
    if (window.confirm('Are you sure you want to delete this password? This action cannot be undone.')) {
      const updatedEncrypted = encryptedPasswords.filter(p => p.id !== passwordId);
      const saved = await saveEncryptedPasswords(updatedEncrypted);
      
      if (!saved) return;
      
      setEncryptedPasswords(updatedEncrypted);
      setDecryptedPasswords(prev => prev.filter(p => p.id !== passwordId));
    }
  };

  const handleGeneratePassword = () => {
    const generated = generateRandomPassword(passwordOptions.length, {
      lowercase: passwordOptions.lowercase,
      uppercase: passwordOptions.uppercase,
      numbers: passwordOptions.numbers,
      symbols: passwordOptions.symbols
    });
    setNewPasswordEntry({ ...newPasswordEntry, password: generated });
  };

  const handleExport = () => {
    if (!window.confirm('⚠️ Warning: This will export your encrypted passwords. Keep the backup file secure!')) {
      return;
    }
    
    const dataStr = JSON.stringify(encryptedPasswords, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `securevault-backup-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      
      if (!Array.isArray(imported)) {
        throw new Error('Invalid backup file format');
      }

      if (window.confirm(`Import ${imported.length} passwords? This will merge with existing passwords.`)) {
        const merged = [...encryptedPasswords, ...imported];
        const saved = await saveEncryptedPasswords(merged);
        
        if (!saved) return;
        
        setEncryptedPasswords(merged);
        alert('✅ Passwords imported successfully! Lock and unlock the vault to see them.');
      }
    } catch (error) {
      alert('❌ Failed to import passwords. Please check the file format.');
    }
    
    e.target.value = '';
  };

  const passwords = isUnlocked ? decryptedPasswords : [];

  const categories = [
    { id: 'all', name: 'All', count: passwords.length },
    { id: 'work', name: 'Work', count: passwords.filter(p => p.category === 'work').length },
    { id: 'personal', name: 'Personal', count: passwords.filter(p => p.category === 'personal').length },
    { id: 'social', name: 'Social', count: passwords.filter(p => p.category === 'social').length },
    { id: 'finance', name: 'Finance', count: passwords.filter(p => p.category === 'finance').length }
  ];

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'weak': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStrengthIcon = (strength) => {
    switch (strength) {
      case 'strong': return <CheckCircle size={16} />;
      case 'medium': return <Shield size={16} />;
      case 'weak': return <AlertTriangle size={16} />;
      default: return <Shield size={16} />;
    }
  };

  const filteredPasswords = passwords.filter(pwd => {
    const matchesCategory = activeCategory === 'all' || pwd.category === activeCategory;
    const matchesSearch = pwd.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pwd.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pwd.url && pwd.url.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: passwords.length,
    strong: passwords.filter(p => p.strength === 'strong').length,
    weak: passwords.filter(p => p.strength === 'weak').length,
    medium: passwords.filter(p => p.strength === 'medium').length
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text, label = '') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or insecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopyFeedback(label || 'Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  const formatLastUsed = (isoString) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-purple-400 flex items-center gap-2">
          <Shield className="animate-pulse" size={24} />
          Loading your vault...
        </div>
      </div>
    );
  }

  // FIRST TIME SETUP
  if (isFirstTime || !isInitialized) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar isUnlocked={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] pt-20 px-4">
          <div className="bg-black border border-purple-600 rounded-lg p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="bg-purple-600/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Key className="text-purple-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Master Password</h2>
              <p className="text-purple-300 text-sm">This password will protect all your stored passwords</p>
            </div>
            <form onSubmit={handleSetupMasterPassword}>
              <div className="mb-4">
                <label className="block text-purple-300 text-sm mb-2 font-medium">Master Password *</label>
                <div className="relative">
                  <input
                    type={showMasterPassword ? 'text' : 'password'}
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-purple-500 rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-purple-400 text-white"
                    required
                    autoFocus
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMasterPassword(!showMasterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showMasterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {masterPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ${getStrengthColor(calculatePasswordStrength(masterPassword))}`}>
                      {getStrengthIcon(calculatePasswordStrength(masterPassword))}
                      Strength: {calculatePasswordStrength(masterPassword)}
                    </div>
                    {calculatePasswordStrength(masterPassword) === 'weak' && (
                      <span className="text-xs text-red-400">Too weak - add more characters</span>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-purple-300 text-sm mb-2 font-medium">Confirm Master Password *</label>
                <input
                  type={showMasterPassword ? 'text' : 'password'}
                  value={confirmMasterPassword}
                  onChange={(e) => setConfirmMasterPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-purple-500 rounded-md px-3 py-2 focus:outline-none focus:border-purple-400 text-white"
                  required
                />
                {confirmMasterPassword && masterPassword !== confirmMasterPassword && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-md p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 text-sm font-medium mb-1">Important Security Notice</p>
                    <ul className="text-yellow-400/90 text-xs space-y-1">
                      <li>• This master password CANNOT be recovered if forgotten</li>
                      <li>• Use a strong, unique password you'll remember</li>
                      <li>• Consider using a passphrase (e.g., "Correct-Horse-Battery-Staple")</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!masterPassword || !confirmMasterPassword || masterPassword !== confirmMasterPassword}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-md font-medium transition-colors"
              >
                Create Secure Vault
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-purple-400">Your passwords will be encrypted with AES-256 encryption</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCK SCREEN
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar isUnlocked={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] pt-20 px-4">
          <div className="bg-black border border-purple-600 rounded-lg p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="bg-purple-600/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Lock className="text-purple-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-purple-300 text-sm">Enter your master password to unlock your vault</p>
            </div>
            <form onSubmit={handleUnlock}>
              <div className="mb-6">
                <label className="block text-purple-300 text-sm mb-2 font-medium">Master Password</label>
                <div className="relative">
                  <input
                    type={showMasterPassword ? 'text' : 'password'}
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-purple-500 rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-purple-400 text-white"
                    required
                    autoFocus
                    placeholder="Enter your master password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMasterPassword(!showMasterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showMasterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition-colors"
              >
                Unlock Vault
              </button>
            </form>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-purple-400">
                <Clock size={14} />
                Auto-locks after 5 minutes of inactivity
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-purple-400">
                <Shield size={14} />
                Protected with AES-256 encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN PASSWORD MANAGER
  return (
    <div className="min-h-screen bg-black text-white">
      {copyFeedback && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2">
          <CheckCircle size={16} />
          {copyFeedback}
        </div>
      )}
      
      <div className="sticky top-0 z-50 bg-black border-b border-purple-600">
        <Navbar 
          isUnlocked={true} 
          onSettingsClick={() => setShowSettingsModal(true)} 
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-black border border-purple-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Passwords</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Shield className="text-purple-400" size={24} />
            </div>
          </div>
          
          <div className="bg-black border border-green-600/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Strong</p>
                <p className="text-2xl font-bold text-green-400">{stats.strong}</p>
              </div>
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>
          
          <div className="bg-black border border-red-600/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm">Weak</p>
                <p className="text-2xl font-bold text-red-400">{stats.weak}</p>
              </div>
              <AlertTriangle className="text-red-400" size={24} />
            </div>
          </div>
          
          <div className="bg-black border border-purple-600 rounded-lg p-4">
            <button
              onClick={handleLock}
              className="w-full h-full flex items-center justify-center gap-2 text-purple-400 hover:text-white transition-colors"
            >
              <Lock size={20} />
              <span>Lock Vault</span>
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-purple-500 rounded-md pl-10 pr-3 py-2 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md flex items-center gap-2 justify-center"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Password</span>
            </button>
            
            <button
              onClick={handleExport}
              className="border border-purple-600 text-purple-400 hover:bg-purple-600/20 px-4 py-2 rounded-md"
              title="Export backup"
            >
              <Download size={18} />
            </button>
            
            <label className="border border-purple-600 text-purple-400 hover:bg-purple-600/20 px-4 py-2 rounded-md cursor-pointer">
              <Upload size={18} />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-black border border-purple-600 text-purple-400 hover:bg-purple-600/20'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-purple-600/20'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-purple-600/20'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Password Display */}
        {filteredPasswords.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="mx-auto mb-4 text-purple-400" size={48} />
            <p className="text-purple-300 mb-4">
              {searchTerm ? 'No passwords found' : 'No passwords yet. Add your first password!'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
              >
                Add Password
              </button>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPasswords.map(password => (
              <div
                key={password.id}
                className="bg-black border border-purple-600 rounded-lg p-4 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-600/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{password.favicon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{password.website}</h3>
                      <p className="text-sm text-purple-300 truncate max-w-[150px]">{password.url || 'No URL'}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStrengthColor(password.strength)}`}>
                    {getStrengthIcon(password.strength)}
                    {password.strength}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">Username</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white truncate max-w-32">{password.username}</span>
                      <button
                        onClick={() => copyToClipboard(password.username, 'Username copied!')}
                        className="opacity-0 group-hover:opacity-100 text-purple-400 hover:text-white transition-all"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">Password</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-mono">
                        {showPassword[password.id] ? password.password : '••••••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(password.id)}
                        className="opacity-0 group-hover:opacity-100 text-purple-400 hover:text-white transition-all"
                      >
                        {showPassword[password.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(password.password, 'Password copied!')}
                        className="opacity-0 group-hover:opacity-100 text-purple-400 hover:text-white transition-all"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {password.notes && (
                    <div className="pt-2 border-t border-purple-600/30">
                      <p className="text-xs text-purple-300 truncate">{password.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-purple-600/30 flex items-center justify-between">
                  <span className="text-xs text-purple-400">Last used: {formatLastUsed(password.lastUsed)}</span>
                  <button
                    onClick={() => handleDelete(password.id)}
                    className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-black border border-purple-600 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-purple-600/10 border-b border-purple-600">
                  <tr>
                    <th className="text-left p-4 text-purple-400">Website</th>
                    <th className="text-left p-4 text-purple-400">Username</th>
                    <th className="text-left p-4 text-purple-400">Strength</th>
                    <th className="text-left p-4 text-purple-400">Last Used</th>
                    <th className="text-left p-4 text-purple-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPasswords.map(password => (
                    <tr key={password.id} className="border-b border-purple-600/30 hover:bg-purple-600/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{password.favicon}</span>
                          <div>
                            <div className="font-medium text-white">{password.website}</div>
                            <div className="text-sm text-purple-300">{password.url || 'No URL'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white">{password.username}</td>
                      <td className="p-4">
                        <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${getStrengthColor(password.strength)}`}>
                          {getStrengthIcon(password.strength)}
                          {password.strength}
                        </div>
                      </td>
                      <td className="p-4 text-purple-300">{formatLastUsed(password.lastUsed)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(password.username, 'Username copied!')}
                            className="text-purple-400 hover:text-white transition-colors"
                            title="Copy username"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => togglePasswordVisibility(password.id)}
                            className="text-purple-400 hover:text-white transition-colors"
                            title="Show password"
                          >
                            {showPassword[password.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(password.password, 'Password copied!')}
                            className="text-purple-400 hover:text-white transition-colors"
                            title="Copy password"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(password.id)}
                            className="text-red-400 hover:text-red-300 transition-colors ml-2"
                            title="Delete"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Password Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-purple-500 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-purple-400">Add New Password</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-purple-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPassword} className="space-y-4">
              <div>
                <label className="block text-purple-300 text-sm mb-2">Website Name *</label>
                <input
                  type="text"
                  value={newPasswordEntry.website}
                  onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, website: e.target.value })}
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 text-white"
                  required
                  placeholder="e.g., Google, Facebook"
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm mb-2">URL</label>
                <input
                  type="text"
                  value={newPasswordEntry.url}
                  onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, url: e.target.value })}
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm mb-2">Username/Email *</label>
                <input
                  type="text"
                  value={newPasswordEntry.username}
                  onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, username: e.target.value })}
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 text-white"
                  required
                  placeholder="username@example.com"
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm mb-2">Password *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPasswordEntry.password}
                    onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, password: e.target.value })}
                    className="flex-1 bg-transparent border border-purple-500 rounded-md px-3 py-2 font-mono text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeneratorOptions(!showGeneratorOptions)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                    title="Password generator"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
                
                {newPasswordEntry.password && (
                  <div className="mt-2">
                    <div className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ${getStrengthColor(calculatePasswordStrength(newPasswordEntry.password))}`}>
                      {getStrengthIcon(calculatePasswordStrength(newPasswordEntry.password))}
                      Strength: {calculatePasswordStrength(newPasswordEntry.password)}
                    </div>
                  </div>
                )}
                
                {showGeneratorOptions && (
                  <div className="mt-3 p-3 bg-black border border-purple-600 rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-300">Length: {passwordOptions.length}</span>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={passwordOptions.length}
                        onChange={(e) => setPasswordOptions({ ...passwordOptions, length: parseInt(e.target.value) })}
                        className="w-32"
                      />
                    </div>
                    
                    <label className="flex items-center gap-2 text-sm text-purple-300">
                      <input
                        type="checkbox"
                        checked={passwordOptions.lowercase}
                        onChange={(e) => setPasswordOptions({ ...passwordOptions, lowercase: e.target.checked })}
                      />
                      Lowercase (a-z)
                    </label>
                    
                    <label className="flex items-center gap-2 text-sm text-purple-300">
                      <input
                        type="checkbox"
                        checked={passwordOptions.uppercase}
                        onChange={(e) => setPasswordOptions({ ...passwordOptions, uppercase: e.target.checked })}
                      />
                      Uppercase (A-Z)
                    </label>
                    
                    <label className="flex items-center gap-2 text-sm text-purple-300">
                      <input
                        type="checkbox"
                        checked={passwordOptions.numbers}
                        onChange={(e) => setPasswordOptions({ ...passwordOptions, numbers: e.target.checked })}
                      />
                      Numbers (0-9)
                    </label>
                    
                    <label className="flex items-center gap-2 text-sm text-purple-300">
                      <input
                        type="checkbox"
                        checked={passwordOptions.symbols}
                        onChange={(e) => setPasswordOptions({ ...passwordOptions, symbols: e.target.checked })}
                      />
                      Symbols (!@#$...)
                    </label>
                    
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm mt-2"
                    >
                      Generate Password
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-purple-300 text-sm mb-2">Category</label>
                <select
                  value={newPasswordEntry.category}
                  onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, category: e.target.value })}
                  className="w-full bg-gray-800 border border-purple-500 rounded-md px-3 py-2 text-white"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="social">Social</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 text-sm mb-2">Icon (emoji)</label>
                <input
                  type="text"
                  value={newPasswordEntry.favicon}
                  onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, favicon: e.target.value })}
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 text-white"
                  placeholder="🔐"
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm mb-2">Notes (optional)</label>
                <textarea
                  value={newPasswordEntry.notes}
                  onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, notes: e.target.value })}
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 text-white"
                  rows="3"
                  placeholder="Additional information..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-purple-400 text-purple-300 rounded-md hover:bg-purple-600/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal - Change Master Password */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-purple-500 p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-purple-400 flex items-center gap-2">
                <Settings size={20} />
                Change Master Password
              </h2>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                className="text-purple-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-md p-3 mb-4">
              <p className="text-yellow-400 text-xs flex items-start gap-2">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                <span>All your passwords will be re-encrypted with the new master password.</span>
              </p>
            </div>

            <form onSubmit={handleChangeMasterPassword} className="space-y-4">
              <div>
                <label className="block text-purple-300 text-sm mb-2">Current Master Password *</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 text-white"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm mb-2">New Master Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 text-white"
                  required
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ${getStrengthColor(calculatePasswordStrength(newPassword))}`}>
                      {getStrengthIcon(calculatePasswordStrength(newPassword))}
                      Strength: {calculatePasswordStrength(newPassword)}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-purple-300 text-sm mb-2">Confirm New Master Password *</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 text-white"
                  required
                />
                {confirmNewPassword && newPassword !== confirmNewPassword && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsModal(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                  className="px-4 py-2 border border-purple-400 text-purple-300 rounded-md hover:bg-purple-600/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!oldPassword || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Passwords;