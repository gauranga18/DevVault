import React, { useState, useEffect } from 'react';
import { Search, Plus, Copy, Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Filter, Grid, List, Lock, Unlock, RefreshCw, X } from 'lucide-react';
import Navbar from './Navbar';
import CryptoJS from 'crypto-js';

// Encryption utilities (inline for simplicity)
const encryptPassword = (password, masterPassword) => {
  const salt = CryptoJS.lib.WordArray.random(128/8).toString();
  const key = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString();
  const encrypted = CryptoJS.AES.encrypt(password, key).toString();
  return { encrypted, salt };
};

const decryptPassword = (encryptedData, salt, masterPassword) => {
  try {
    const key = CryptoJS.PBKDF2(masterPassword, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};

const calculatePasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

const generateRandomPassword = (length = 16) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
};

function Passwords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [showPassword, setShowPassword] = useState({});
  
  // Vault state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  
  // Passwords state
  const [encryptedPasswords, setEncryptedPasswords] = useState([]);
  const [decryptedPasswords, setDecryptedPasswords] = useState([]);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPassword, setNewPassword] = useState({
    website: '',
    url: '',
    username: '',
    password: '',
    category: 'personal',
    favicon: '🔐'
  });

  // Load encrypted passwords from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('encrypted_passwords');
    if (stored) {
      setEncryptedPasswords(JSON.parse(stored));
    }
  }, []);

  // Save encrypted passwords to localStorage
  useEffect(() => {
    if (encryptedPasswords.length > 0) {
      localStorage.setItem('encrypted_passwords', JSON.stringify(encryptedPasswords));
    }
  }, [encryptedPasswords]);

  const handleUnlock = (e) => {
    e.preventDefault();
    
    if (encryptedPasswords.length === 0) {
      // No passwords yet, just unlock
      setIsUnlocked(true);
      return;
    }

    // Try to decrypt all passwords
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
      alert('Invalid master password!');
      return;
    }

    setDecryptedPasswords(decrypted);
    setIsUnlocked(true);
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setMasterPassword('');
    setDecryptedPasswords([]);
    setShowPassword({});
  };

  const handleAddPassword = (e) => {
    e.preventDefault();

    if (!newPassword.website || !newPassword.username || !newPassword.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Encrypt the password
    const { encrypted, salt } = encryptPassword(newPassword.password, masterPassword);
    
    // Calculate strength
    const strength = calculatePasswordStrength(newPassword.password);

    // Create new password entry
    const newEntry = {
      id: Date.now(),
      website: newPassword.website,
      url: newPassword.url,
      username: newPassword.username,
      encryptedPassword: encrypted,
      salt: salt,
      strength: strength,
      category: newPassword.category,
      favicon: newPassword.favicon,
      lastUsed: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Add to encrypted passwords
    setEncryptedPasswords(prev => [...prev, newEntry]);

    // Add to decrypted passwords (current session)
    setDecryptedPasswords(prev => [...prev, {
      ...newEntry,
      password: newPassword.password
    }]);

    // Reset form
    setShowAddModal(false);
    setNewPassword({
      website: '',
      url: '',
      username: '',
      password: '',
      category: 'personal',
      favicon: '🔐'
    });
  };

  const handleDelete = (passwordId) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      setEncryptedPasswords(prev => prev.filter(p => p.id !== passwordId));
      setDecryptedPasswords(prev => prev.filter(p => p.id !== passwordId));
    }
  };

  const handleGeneratePassword = () => {
    const generated = generateRandomPassword(16);
    setNewPassword({ ...newPassword, password: generated });
  };

  // Use decrypted passwords if unlocked, otherwise empty
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
      case 'strong': return React.createElement(CheckCircle, { size: 16 });
      case 'medium': return React.createElement(Shield, { size: 16 });
      case 'weak': return React.createElement(AlertTriangle, { size: 16 });
      default: return React.createElement(Shield, { size: 16 });
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

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
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
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // UNLOCK SCREEN
  if (!isUnlocked) {
    return React.createElement('div', {
      className: "min-h-screen bg-black text-white"
    }, [
      React.createElement(Navbar, { key: 'navbar' }),
      React.createElement('div', {
        key: 'unlock-screen',
        className: "flex items-center justify-center min-h-[calc(100vh-80px)] pt-20"
      },
        React.createElement('div', {
          className: "bg-black border border-purple-600 rounded-lg p-8 w-96"
        }, [
          React.createElement('div', {
            key: 'header',
            className: "text-center mb-6"
          }, [
            React.createElement(Lock, {
              key: 'lock-icon',
              className: "mx-auto mb-4 text-purple-400",
              size: 48
            }),
            React.createElement('h2', {
              key: 'title',
              className: "text-2xl font-bold text-white mb-2"
            }, 'Unlock Your Vault'),
            React.createElement('p', {
              key: 'subtitle',
              className: "text-purple-300 text-sm"
            }, 'Enter your master password to access your passwords')
          ]),
          React.createElement('form', {
            key: 'form',
            onSubmit: handleUnlock
          }, [
            React.createElement('div', {
              key: 'input-group',
              className: "mb-4"
            }, [
              React.createElement('label', {
                key: 'label',
                className: "block text-purple-300 text-sm mb-2"
              }, 'Master Password'),
              React.createElement('div', {
                key: 'input-wrapper',
                className: "relative"
              }, [
                React.createElement('input', {
                  key: 'input',
                  type: showMasterPassword ? 'text' : 'password',
                  value: masterPassword,
                  onChange: (e) => setMasterPassword(e.target.value),
                  className: "w-full bg-transparent border border-purple-500 rounded-md px-3 py-2 pr-10",
                  required: true,
                  autoFocus: true
                }),
                React.createElement('button', {
                  key: 'toggle-btn',
                  type: 'button',
                  onClick: () => setShowMasterPassword(!showMasterPassword),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
                }, showMasterPassword ? React.createElement(EyeOff, { size: 18 }) : React.createElement(Eye, { size: 18 }))
              ])
            ]),
            React.createElement('button', {
              key: 'submit',
              type: 'submit',
              className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
            }, 'Unlock Vault')
          ])
        ])
      )
    ]);
  }

  // MAIN PASSWORD MANAGER
  return React.createElement('div', {
    className: "min-h-screen bg-black text-white"
  }, [
    React.createElement('div', {
      key: 'navbar-wrapper',
      className: "sticky top-0 z-50 bg-black border-b border-purple-600"
    }, [
      React.createElement(Navbar, { key: 'navbar' })
    ]),
    
    React.createElement('div', {
      key: 'main',
      className: "max-w-7xl mx-auto px-6 py-6 pt-20"
    }, [
      // Stats Cards
      React.createElement('div', {
        key: 'stats',
        className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      }, [
        React.createElement('div', {
          key: 'stat-total',
          className: "bg-black border border-purple-600 rounded-lg p-4"
        }, 
          React.createElement('div', {
            className: "flex items-center justify-between"
          }, [
            React.createElement('div', { key: 'stat-content' }, [
              React.createElement('p', {
                key: 'stat-label',
                className: "text-purple-300 text-sm"
              }, 'Total Passwords'),
              React.createElement('p', {
                key: 'stat-value',
                className: "text-2xl font-bold text-white"
              }, stats.total)
            ]),
            React.createElement(Shield, {
              key: 'stat-icon',
              className: "text-purple-400",
              size: 24
            })
          ])
        ),
        React.createElement('div', {
          key: 'stat-strong',
          className: "bg-black border border-green-600/50 rounded-lg p-4"
        }, 
          React.createElement('div', {
            className: "flex items-center justify-between"
          }, [
            React.createElement('div', { key: 'stat-content' }, [
              React.createElement('p', {
                key: 'stat-label',
                className: "text-green-300 text-sm"
              }, 'Strong'),
              React.createElement('p', {
                key: 'stat-value',
                className: "text-2xl font-bold text-green-400"
              }, stats.strong)
            ]),
            React.createElement(CheckCircle, {
              key: 'stat-icon',
              className: "text-green-400",
              size: 24
            })
          ])
        ),
        React.createElement('div', {
          key: 'stat-weak',
          className: "bg-black border border-red-600/50 rounded-lg p-4"
        }, 
          React.createElement('div', {
            className: "flex items-center justify-between"
          }, [
            React.createElement('div', { key: 'stat-content' }, [
              React.createElement('p', {
                key: 'stat-label',
                className: "text-red-300 text-sm"
              }, 'Weak'),
              React.createElement('p', {
                key: 'stat-value',
                className: "text-2xl font-bold text-red-400"
              }, stats.weak)
            ]),
            React.createElement(AlertTriangle, {
              key: 'stat-icon',
              className: "text-red-400",
              size: 24
            })
          ])
        ),
        React.createElement('div', {
          key: 'stat-lock',
          className: "bg-black border border-purple-600 rounded-lg p-4"
        }, 
          React.createElement('button', {
            onClick: handleLock,
            className: "w-full h-full flex items-center justify-center gap-2 text-purple-400 hover:text-white transition-colors"
          }, [
            React.createElement(Lock, { key: 'lock-icon', size: 20 }),
            React.createElement('span', { key: 'lock-text' }, 'Lock Vault')
          ])
        )
      ]),

      // Search and Add Button
      React.createElement('div', {
        key: 'search-bar',
        className: "flex flex-col sm:flex-row gap-3 mb-6"
      }, [
        React.createElement('div', {
          key: 'search-wrapper',
          className: "flex-1 relative"
        }, [
          React.createElement(Search, {
            key: 'search-icon',
            className: "absolute left-3 top-1/2 -translate-y-1/2 text-purple-400",
            size: 18
          }),
          React.createElement('input', {
            key: 'search-input',
            type: 'text',
            placeholder: 'Search passwords...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full bg-transparent border border-purple-500 rounded-md pl-10 pr-3 py-2"
          })
        ]),
        React.createElement('button', {
          key: 'add-btn',
          onClick: () => setShowAddModal(true),
          className: "bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md flex items-center gap-2 justify-center"
        }, [
          React.createElement(Plus, { key: 'plus-icon', size: 18 }),
          React.createElement('span', { key: 'add-text' }, 'Add Password')
        ])
      ]),

      // Filters and View Toggle
      React.createElement('div', {
        key: 'controls',
        className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      }, [
        React.createElement('div', {
          key: 'categories',
          className: "flex flex-wrap items-center gap-2"
        }, 
          categories.map(category => 
            React.createElement('button', {
              key: category.id,
              onClick: () => setActiveCategory(category.id),
              className: `px-4 py-2 rounded-lg transition-all ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-black border border-purple-600 text-purple-400 hover:bg-purple-600/20'
              }`
            }, `${category.name} (${category.count})`)
          )
        ),
        React.createElement('div', {
          key: 'view-toggle',
          className: "flex items-center gap-2"
        }, [
          React.createElement('button', {
            key: 'cards-view',
            onClick: () => setViewMode('cards'),
            className: `p-2 rounded-lg transition-colors ${
              viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-purple-600/20'
            }`
          }, React.createElement(Grid, { size: 18 })),
          React.createElement('button', {
            key: 'list-view',
            onClick: () => setViewMode('list'),
            className: `p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-purple-600/20'
            }`
          }, React.createElement(List, { size: 18 }))
        ])
      ]),

      // Empty State
      filteredPasswords.length === 0 
        ? React.createElement('div', {
            key: 'empty-state',
            className: "text-center py-12"
          }, [
            React.createElement(Shield, {
              key: 'shield-icon',
              className: "mx-auto mb-4 text-purple-400",
              size: 48
            }),
            React.createElement('p', {
              key: 'empty-text',
              className: "text-purple-300 mb-4"
            }, searchTerm ? 'No passwords found' : 'No passwords yet. Add your first password!'),
            React.createElement('button', {
              key: 'empty-add-btn',
              onClick: () => setShowAddModal(true),
              className: "bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
            }, 'Add Password')
          ])
        : // Password Cards
          viewMode === 'cards' 
            ? React.createElement('div', {
                key: 'cards-view',
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              }, 
              filteredPasswords.map(password =>
                React.createElement('div', {
                  key: password.id,
                  className: "bg-black border border-purple-600 rounded-lg p-4 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-600/20 transition-all group"
                }, [
                  React.createElement('div', {
                    key: 'card-header',
                    className: "flex items-center justify-between mb-3"
                  }, [
                    React.createElement('div', {
                      key: 'card-info',
                      className: "flex items-center gap-3"
                    }, [
                      React.createElement('span', {
                        key: 'favicon',
                        className: "text-2xl"
                      }, password.favicon),
                      React.createElement('div', { key: 'site-info' }, [
                        React.createElement('h3', {
                          key: 'website',
                          className: "font-semibold text-white"
                        }, password.website),
                        React.createElement('p', {
                          key: 'url',
                          className: "text-sm text-purple-300"
                        }, password.url || 'No URL')
                      ])
                    ]),
                    React.createElement('div', {
                      key: 'strength-badge',
                      className: `px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStrengthColor(password.strength)}`
                    }, [
                      getStrengthIcon(password.strength),
                      password.strength
                    ])
                  ]),
                  React.createElement('div', {
                    key: 'card-content',
                    className: "space-y-2"
                  }, [
                    React.createElement('div', {
                      key: 'username-row',
                      className: "flex items-center justify-between"
                    }, [
                      React.createElement('span', {
                        key: 'username-label',
                        className: "text-sm text-purple-300"
                      }, 'Username'),
                      React.createElement('div', {
                        key: 'username-value',
                        className: "flex items-center gap-2"
                      }, [
                        React.createElement('span', {
                          key: 'username',
                          className: "text-sm text-white truncate max-w-32"
                        }, password.username),
                        React.createElement('button', {
                          key: 'copy-username',
                          onClick: () => copyToClipboard(password.username),
                          className: "opacity-0 group-hover:opacity-100 text-purple-400 hover:text-white transition-all"
                        }, React.createElement(Copy, { size: 14 }))
                      ])
                    ]),
                    React.createElement('div', {
                      key: 'password-row',
                      className: "flex items-center justify-between"
                    }, [
                      React.createElement('span', {
                        key: 'password-label',
                        className: "text-sm text-purple-300"
                      }, 'Password'),
                      React.createElement('div', {
                        key: 'password-value',
                        className: "flex items-center gap-2"
                      }, [
                        React.createElement('span', {
                          key: 'password',
                          className: "text-sm text-white font-mono"
                        }, showPassword[password.id] ? password.password : '••••••••••••'),
                        React.createElement('button', {
                          key: 'toggle-password',
                          onClick: () => togglePasswordVisibility(password.id),
                          className: "opacity-0 group-hover:opacity-100 text-purple-400 hover:text-white transition-all"
                        }, showPassword[password.id] ? React.createElement(EyeOff, { size: 14 }) : React.createElement(Eye, { size: 14 })),
                        React.createElement('button', {
                          key: 'copy-password',
                          onClick: () => copyToClipboard(password.password),
                          className: "opacity-0 group-hover:opacity-100 text-purple-400 hover:text-white transition-all"
                        }, React.createElement(Copy, { size: 14 }))
                      ])
                    ])
                  ]),
                  React.createElement('div', {
                    key: 'card-footer',
                    className: "mt-3 pt-3 border-t border-purple-600/30 flex items-center justify-between"
                  }, [
                    React.createElement('span', {
                      key: 'last-used',
                      className: "text-xs text-purple-400"
                    }, `Last used: ${formatLastUsed(password.lastUsed)}`),
                    React.createElement('button', {
                      key: 'delete-btn',
                      onClick: () => handleDelete(password.id),
                      className: "text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                    }, 'Delete')
                  ])
                ])
              )
            )
            : React.createElement('div', {
                key: 'list-view',
                className: "bg-black border border-purple-600 rounded-lg overflow-hidden"
              }, 
                React.createElement('div', {
                  className: "overflow-x-auto"
                },
                  React.createElement('table', {
                    className: "w-full min-w-[800px]"
                  }, [
                    React.createElement('thead', {
                      key: 'table-head',
                      className: "bg-purple-600/10 border-b border-purple-600"
                    },
                      React.createElement('tr', {}, [
                        React.createElement('th', { key: 'th-website', className: "text-left p-4 text-purple-400" }, 'Website'),
                        React.createElement('th', { key: 'th-username', className: "text-left p-4 text-purple-400" }, 'Username'),
                        React.createElement('th', { key: 'th-strength', className: "text-left p-4 text-purple-400" }, 'Strength'),
                        React.createElement('th', { key: 'th-lastused', className: "text-left p-4 text-purple-400" }, 'Last Used'),
                        React.createElement('th', { key: 'th-actions', className: "text-left p-4 text-purple-400" }, 'Actions')
                      ])
                    ),
                    React.createElement('tbody', {
                      key: 'table-body'
                    },
                      filteredPasswords.map(password =>
                        React.createElement('tr', {
                          key: password.id,
                          className: "border-b border-purple-600/30 hover:bg-purple-600/5"
                        }, [
                          React.createElement('td', { key: 'td-website', className: "p-4" },
                            React.createElement('div', {
                              className: "flex items-center gap-3"
                            }, [
                              React.createElement('span', { key: 'favicon', className: "text-xl" }, password.favicon),
                              React.createElement('div', { key: 'site-info' }, [
                                React.createElement('div', { key: 'website', className: "font-medium text-white" }, password.website),
                                React.createElement('div', { key: 'url', className: "text-sm text-purple-300" }, password.url || 'No URL')
                              ])
                            ])
                          ),
                          React.createElement('td', { key: 'td-username', className: "p-4 text-white" }, password.username),
                          React.createElement('td', { key: 'td-strength', className: "p-4" },
                            React.createElement('div', {
                              className: `px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${getStrengthColor(password.strength)}`
                            }, [
                              getStrengthIcon(password.strength),
                              password.strength
                            ])
                          ),
                          React.createElement('td', { key: 'td-lastused', className: "p-4 text-purple-300" }, formatLastUsed(password.lastUsed)),
                          React.createElement('td', { key: 'td-actions', className: "p-4" },
                            React.createElement('div', {
                              className: "flex items-center gap-2"
                            }, [
                              React.createElement('button', {
                                key: 'copy-username-btn',
                                onClick: () => copyToClipboard(password.username),
                                className: "text-purple-400 hover:text-white transition-colors",
                                title: "Copy username"
                              }, React.createElement(Copy, { size: 16 })),
                              React.createElement('button', {
                                key: 'toggle-password-btn',
                                onClick: () => togglePasswordVisibility(password.id),
                                className: "text-purple-400 hover:text-white transition-colors",
                                title: "Show password"
                              }, showPassword[password.id] ? React.createElement(EyeOff, { size: 16 }) : React.createElement(Eye, { size: 16 })),
                              React.createElement('button', {
                                key: 'copy-password-btn',
                                onClick: () => copyToClipboard(password.password),
                                className: "text-purple-400 hover:text-white transition-colors",
                                title: "Copy password"
                              }, React.createElement(Copy, { size: 16 }))
                            ])
                          )
                        ])
                      )
                    )
                  ])
                )
              )
    ]),

    // Add Password Modal
    showAddModal && React.createElement('div', {
      key: 'modal',
      className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
    },
      React.createElement('div', {
        className: "bg-gray-900 border border-purple-500 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
      }, [
        React.createElement('h2', {
          key: 'modal-title',
          className: "text-lg text-purple-400 mb-4"
        }, 'Add New Password'),

        React.createElement('form', {
          key: 'modal-form',
          onSubmit: handleAddPassword,
          className: "space-y-4"
        }, [
          React.createElement('div', {
            key: 'website-field'
          }, [
            React.createElement('label', {
              key: 'label',
              className: "block text-purple-300 text-sm mb-2"
            }, 'Website Name *'),
            React.createElement('input', {
              key: 'input',
              type: 'text',
              value: newPassword.website,
              onChange: (e) => setNewPassword({ ...newPassword, website: e.target.value }),
              className: "w-full bg-transparent border border-purple-500 rounded-md px-3 py-2",
              required: true
            })
          ]),

          React.createElement('div', {
            key: 'url-field'
          }, [
            React.createElement('label', {
              key: 'label',
              className: "block text-purple-300 text-sm mb-2"
            }, 'URL'),
            React.createElement('input', {
              key: 'input',
              type: 'text',
              value: newPassword.url,
              onChange: (e) => setNewPassword({ ...newPassword, url: e.target.value }),
              className: "w-full bg-transparent border border-purple-500 rounded-md px-3 py-2",
              placeholder: "https://example.com"
            })
          ]),

          React.createElement('div', {
            key: 'username-field'
          }, [
            React.createElement('label', {
              key: 'label',
              className: "block text-purple-300 text-sm mb-2"
            }, 'Username/Email *'),
            React.createElement('input', {
              key: 'input',
              type: 'text',
              value: newPassword.username,
              onChange: (e) => setNewPassword({ ...newPassword, username: e.target.value }),
              className: "w-full bg-transparent border border-purple-500 rounded-md px-3 py-2",
              required: true
            })
          ]),

          React.createElement('div', {
            key: 'password-field'
          }, [
            React.createElement('label', {
              key: 'label',
              className: "block text-purple-300 text-sm mb-2"
            }, 'Password *'),
            React.createElement('div', {
              key: 'input-wrapper',
              className: "flex gap-2"
            }, [
              React.createElement('input', {
                key: 'input',
                type: 'text',
                value: newPassword.password,
                onChange: (e) => setNewPassword({ ...newPassword, password: e.target.value }),
                className: "flex-1 bg-transparent border border-purple-500 rounded-md px-3 py-2 font-mono",
                required: true
              }),
              React.createElement('button', {
                key: 'generate-btn',
                type: 'button',
                onClick: handleGeneratePassword,
                className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md",
                title: "Generate random password"
              }, React.createElement(RefreshCw, { size: 18 }))
            ])
          ]),

          React.createElement('div', {
            key: 'category-field'
          }, [
            React.createElement('label', {
              key: 'label',
              className: "block text-purple-300 text-sm mb-2"
            }, 'Category'),
            React.createElement('select', {
              key: 'select',
              value: newPassword.category,
              onChange: (e) => setNewPassword({ ...newPassword, category: e.target.value }),
              className: "w-full bg-gray-800 border border-purple-500 rounded-md px-3 py-2"
            }, [
              React.createElement('option', { key: 'personal', value: 'personal' }, 'Personal'),
              React.createElement('option', { key: 'work', value: 'work' }, 'Work'),
              React.createElement('option', { key: 'social', value: 'social' }, 'Social'),
              React.createElement('option', { key: 'finance', value: 'finance' }, 'Finance')
            ])
          ]),

          React.createElement('div', {
            key: 'favicon-field'
          }, [
            React.createElement('label', {
              key: 'label',
              className: "block text-purple-300 text-sm mb-2"
            }, 'Icon (emoji)'),
            React.createElement('input', {
              key: 'input',
              type: 'text',
              value: newPassword.favicon,
              onChange: (e) => setNewPassword({ ...newPassword, favicon: e.target.value }),
              className: "w-full bg-transparent border border-purple-500 rounded-md px-3 py-2",
              placeholder: "🔐"
            })
          ]),

          React.createElement('div', {
            key: 'buttons',
            className: "flex justify-end gap-3 pt-4"
          }, [
            React.createElement('button', {
              key: 'cancel',
              type: 'button',
              onClick: () => setShowAddModal(false),
              className: "px-4 py-2 border border-purple-400 text-purple-300 rounded-md"
            }, 'Cancel'),

            React.createElement('button', {
              key: 'submit',
              type: 'submit',
              className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            }, 'Save Password')
          ])
        ])
      ])
    )
  ]);
}

export default Passwords;