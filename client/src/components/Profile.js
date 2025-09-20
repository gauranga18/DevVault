import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, Mail, MapPin, Link, Github, Twitter, Linkedin, Edit3, Star, LogOut } from 'lucide-react';
import Navbar from './Navbar';

const Profile = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth0();

  // Show loading while Auth0 is checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please log in to view your profile</h2>
          <p className="text-gray-400">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-20 pb-8">
        {/* Added pt-20 so content sits below navbar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Left Side - Profile Card */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-2 border-purple-500 mb-6 flex items-center justify-center shadow-xl shadow-purple-500/20 overflow-hidden">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name || 'Profile'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-purple-400 opacity-80" />
                )}
              </div>
              <button className="absolute bottom-2 right-1 sm:right-4 bg-gray-800 hover:bg-gray-700 text-white p-1 sm:p-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-110">
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                Hi <span className="text-purple-400">{user?.name || user?.nickname || 'User'}</span> 👋
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">
                {user?.['https://devvault.app/role'] || 'Developer'}
              </p>

              {/* Stats */}
              <div className="flex justify-center space-x-3 sm:space-x-6 text-xs sm:text-sm mb-4 sm:mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-purple-400 font-semibold text-sm sm:text-lg">128</span>
                  <span className="text-gray-400 text-[10px] sm:text-xs">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-purple-400 font-semibold text-sm sm:text-lg">42</span>
                  <span className="text-gray-400 text-[10px] sm:text-xs">Following</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-purple-400 font-semibold text-sm sm:text-lg">16</span>
                  <span className="text-gray-400 text-[10px] sm:text-xs">Projects</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-2 sm:space-x-3">
                <button className="bg-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-700 transition-all duration-200 shadow-md shadow-purple-500/30">
                  Edit Profile
                </button>
                <button 
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-all duration-200 border border-red-700 flex items-center"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="w-full bg-gray-900/50 border border-purple-500/20 rounded-xl p-3 sm:p-5 mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-lg font-semibold text-purple-400 mb-3 sm:mb-4">
                Contact Info
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">
                    {user?.email || 'No email provided'}
                  </span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {user?.['https://devvault.app/location'] || 'Location not set'}
                  </span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Link className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">
                    {user?.['https://devvault.app/website'] || 'Website not set'}
                  </span>
                </div>
              </div>

              {/* Socials */}
              <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-800">
                <button className="p-1.5 sm:p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <button className="p-1.5 sm:p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <button className="p-1.5 sm:p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* User Metadata */}
            <div className="bg-gray-900/40 border border-purple-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-semibold text-purple-400">Account Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-400">User ID:</span>
                  <p className="text-white font-mono break-all">{user?.sub}</p>
                </div>
                <div>
                  <span className="text-gray-400">Email Verified:</span>
                  <p className="text-white">
                    {user?.email_verified ? 
                      <span className="text-green-400">✓ Verified</span> : 
                      <span className="text-red-400">✗ Not Verified</span>
                    }
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Last Updated:</span>
                  <p className="text-white">
                    {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Provider:</span>
                  <p className="text-white capitalize">{user?.sub?.split('|')[0] || 'Unknown'}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-gray-900/40 border border-purple-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-semibold text-purple-400">About Me</h3>
                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {user?.['https://devvault.app/bio'] || 
                 "Welcome to DevVault! Update your bio in your profile settings to tell others about yourself, your experience, and what you're passionate about."
                }
              </p>
            </div>

            {/* Recent Repositories */}
            <div className="bg-gray-900/40 border border-purple-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-semibold text-purple-400">Recent Repositories</h3>
                <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all</button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { name: 'devvault-frontend', desc: 'Personal project manager built with React and Auth0', stars: 42 },
                  { name: 'my-portfolio', desc: 'Personal portfolio website showcasing my projects', stars: 28 },
                  { name: 'learning-resources', desc: 'Curated list of development resources and tutorials', stars: 15 },
                ].map((repo) => (
                  <div key={repo.name} className="flex justify-between items-center p-2 sm:p-3 bg-gray-800/40 rounded-lg hover:bg-gray-800/60 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium flex items-center text-sm sm:text-base">
                        <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-400 flex-shrink-0" />
                        <span className="truncate">{repo.name}</span>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{repo.desc}</div>
                    </div>
                    <div className="flex items-center text-purple-400 text-xs sm:text-sm ml-2 flex-shrink-0">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                      {repo.stars}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-900/40 border border-purple-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-semibold text-purple-400">Skills & Technologies</h3>
                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {['JavaScript','React','Node.js','TypeScript','Python','MongoDB','PostgreSQL','Docker','AWS'].map((skill) => (
                  <span key={skill} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-purple-600/20 text-purple-300 rounded-lg text-xs sm:text-sm text-center border border-purple-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;