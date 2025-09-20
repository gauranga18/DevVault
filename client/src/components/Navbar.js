import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent border-b border-purple-500 px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <h1 className="text-purple-500 text-xl sm:text-2xl font-thin tracking-widest">
              DEV VAULT
            </h1>
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/Notes"
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base"
            >
              NOTES
            </Link>
            <Link
              to="/Passwords"
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base"
            >
              PASSWORDS
            </Link>
            <Link
              to="/Projects"
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base"
            >
              PROJECTS
            </Link>
          </nav>
        </div>

        {/* Right side (User Icon) */}
        <button 
          onClick={() => navigate('/Profile')}
          className="text-purple-500 hover:text-purple-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;