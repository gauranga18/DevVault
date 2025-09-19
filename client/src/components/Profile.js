import React from 'react';
import { User, Mail, MapPin, Link, Github, Twitter, Linkedin, Edit3, Star } from 'lucide-react';
import Navbar from './Navbar';

const Profile = () => {
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
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-2 border-purple-500 mb-6 flex items-center justify-center shadow-xl shadow-purple-500/20">
                <User className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-purple-400 opacity-80" />
              </div>
              <button className="absolute bottom-2 right-1 sm:right-4 bg-gray-800 hover:bg-gray-700 text-white p-1 sm:p-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-110">
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                Hi <span className="text-purple-400">Alex Johnson</span> 👋
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">Full-Stack Developer</p>

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
                  Follow
                </button>
                <button className="bg-gray-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 transition-all duration-200 border border-gray-700">
                  Message
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
                  <span className="text-xs sm:text-sm truncate">alex.johnson@example.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Link className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">alexjohnson.dev</span>
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
            {/* Bio */}
            <div className="bg-gray-900/40 border border-purple-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-semibold text-purple-400">About Me</h3>
                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Full-stack developer with over 5 years of experience passionate about creating
                innovative solutions. I love working with React, Node.js, and exploring new
                technologies. Currently focused on building scalable web applications with modern
                tech stacks. In my free time, I contribute to open-source projects and write
                technical articles.
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
                  { name: 'awesome-react-app', desc: 'A modern React application with TypeScript and Tailwind CSS', stars: 42 },
                  { name: 'python-ml-toolkit', desc: 'Machine learning utilities for data scientists', stars: 28 },
                  { name: 'devvault-frontend', desc: 'Password manager application built with React', stars: 15 },
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
