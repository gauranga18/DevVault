import React, { useState } from 'react';
import { Search, Plus, Copy, Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Filter, Grid, List } from 'lucide-react';
import Navbar from './Navbar';

function Passwords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [showPassword, setShowPassword] = useState({});

  const categories = [
    { id: 'all', name: 'All', count: 127 },
    { id: 'work', name: 'Work', count: 45 },
    { id: 'personal', name: 'Personal', count: 32 },
    { id: 'social', name: 'Social', count: 28 },
    { id: 'finance', name: 'Finance', count: 22 }
  ];

  const passwords = [
    {
      id: 1,
      website: 'GitHub',
      url: 'github.com',
      username: 'dev.john123',
      password: 'Gh!2k9$mP@ssw0rd',
      strength: 'strong',
      lastUsed: '2 hours ago',
      category: 'work',
      favicon: '🐙'
    },
    {
      id: 2,
      website: 'Gmail',
      url: 'gmail.com',
      username: 'john.doe@email.com',
      password: 'myemail123',
      strength: 'weak',
      lastUsed: '5 hours ago',
      category: 'personal',
      favicon: '📧'
    },
    {
      id: 3,
      website: 'AWS Console',
      url: 'aws.amazon.com',
      username: 'admin.user',
      password: 'AWS!2024#SecureP@ss',
      strength: 'strong',
      lastUsed: '1 day ago',
      category: 'work',
      favicon: '☁️'
    },
    {
      id: 4,
      website: 'Netflix',
      url: 'netflix.com',
      username: 'john.streaming',
      password: 'netflix2023',
      strength: 'medium',
      lastUsed: '3 days ago',
      category: 'personal',
      favicon: '🎬'
    },
    {
      id: 5,
      website: 'Chase Bank',
      url: 'chase.com',
      username: 'john.doe.banking',
      password: 'Ch@se!B@nk2024$',
      strength: 'strong',
      lastUsed: '1 week ago',
      category: 'finance',
      favicon: '🏦'
    },
    {
      id: 6,
      website: 'LinkedIn',
      url: 'linkedin.com',
      username: 'johndoe.dev',
      password: 'LinkedIn123',
      strength: 'medium',
      lastUsed: '2 days ago',
      category: 'social',
      favicon: '💼'
    }
  ];

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': 
        return 'text-green-400 bg-green-400/20';
      case 'medium': 
        return 'text-yellow-400 bg-yellow-400/20';
      case 'weak': 
        return 'text-red-400 bg-red-400/20';
      default: 
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStrengthIcon = (strength) => {
    switch (strength) {
      case 'strong': 
        return React.createElement(CheckCircle, { size: 16 });
      case 'medium': 
        return React.createElement(Shield, { size: 16 });
      case 'weak': 
        return React.createElement(AlertTriangle, { size: 16 });
      default: 
        return React.createElement(Shield, { size: 16 });
    }
  };

  const filteredPasswords = passwords.filter(pwd => {
    const matchesCategory = activeCategory === 'all' || pwd.category === activeCategory;
    const matchesSearch = pwd.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pwd.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pwd.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: passwords.length,
    strong: passwords.filter(p => p.strength === 'strong').length,
    weak: passwords.filter(p => p.strength === 'weak').length,
    compromised: 0
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  return React.createElement('div', {
    className: "min-h-screen bg-black text-white"
  }, [
    React.createElement('div', {
      key: 'navbar-wrapper',
      className: "sticky top-0 z-50 bg-black border-b border-purple-600"
    }, [
      React.createElement(Navbar, { key: 'navbar' })
    ]),
    // Main Content with proper top padding
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
              }, 'Strong Passwords'),
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
              }, 'Weak Passwords'),
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
          key: 'stat-activity',
          className: "bg-black border border-purple-600 rounded-lg p-4"
        }, 
          React.createElement('div', {
            className: "flex items-center justify-between"
          }, [
            React.createElement('div', { key: 'stat-content' }, [
              React.createElement('p', {
                key: 'stat-label',
                className: "text-purple-300 text-sm"
              }, 'Recent Activity'),
              React.createElement('p', {
                key: 'stat-value',
                className: "text-2xl font-bold text-white"
              }, '12')
            ]),
            React.createElement('div', {
              key: 'stat-icon',
              className: "w-6 h-6 bg-purple-400 rounded-full"
            })
          ])
        )
      ]),

      // Filters and View Toggle
      React.createElement('div', {
        key: 'controls',
        className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      }, [
        React.createElement('div', {
          key: 'categories',
          className: "flex flex-wrap items-center gap-2"
        }, [
          ...categories.map(category => 
            React.createElement('button', {
              key: category.id,
              onClick: () => setActiveCategory(category.id),
              className: `px-4 py-2 rounded-lg transition-all ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-black border border-purple-600 text-purple-400 hover:bg-purple-600/20'
              }`
            }, `${category.name} (${category.count})`)
          ),
          React.createElement('button', {
            key: 'filter-btn',
            className: "px-4 py-2 bg-black border border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600/20 transition-colors flex items-center gap-2"
          }, [
            React.createElement(Filter, { key: 'filter-icon', size: 16 }),
            'Filters'
          ])
        ]),
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

      // Password Content
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
                    }, password.url)
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
                className: "mt-3 pt-3 border-t border-purple-600/30 text-xs text-purple-400"
              }, `Last used: ${password.lastUsed}`)
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
                            React.createElement('div', { key: 'url', className: "text-sm text-purple-300" }, password.url)
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
                      React.createElement('td', { key: 'td-lastused', className: "p-4 text-purple-300" }, password.lastUsed),
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
    ])
  ]);
}

export default Passwords;