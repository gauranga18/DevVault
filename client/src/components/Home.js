import React from 'react';
import Projects from './Projects';
const Home = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Main title */}
        <h1 className="text-8xl font-thin tracking-widest mb-16">
          <span className="text-purple-500">DEV</span>
          <span className="ml-4 text-purple-500">VAULT</span>
        </h1>
        
        {/* 3D Cube with Arrow Button */}
        <div className="mb-16 flex justify-center">
          <div className="relative w-32 h-32 cursor-pointer group" style={{ perspective: '200px' }}>
            {/* 3D Cube */}
            <div 
              className="w-24 h-24 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:rotate-y-12 group-hover:rotate-x-12"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'translate(-50%, -50%) rotateX(-15deg) rotateY(25deg)'
              }}
            >
              {/* Front face */}
              <div 
                className="absolute w-24 h-24 border-2 border-purple-500 bg-purple-900 bg-opacity-20 flex items-center justify-center"
                style={{ transform: 'translateZ(12px)' }}
              >
                {/* Arrow pointing right */}
                {/* <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg> */}
              </div>
              
              {/* Back face */}
              <div 
                className="absolute w-24 h-24 border-2 border-purple-400 bg-purple-800 bg-opacity-15"
                style={{ transform: 'translateZ(-12px) rotateY(180deg)' }}
              ></div>
              
              {/* Right face */}
              <div 
                className="absolute w-24 h-24 border-2 border-purple-400 bg-purple-800 bg-opacity-25"
                style={{ transform: 'rotateY(90deg) translateZ(12px)' }}
              ></div>
              
              {/* Left face */}
              <div 
                className="absolute w-24 h-24 border-2 border-purple-400 bg-purple-700 bg-opacity-20"
                style={{ transform: 'rotateY(-90deg) translateZ(12px)' }}
              ></div>
              
              {/* Top face */}
              <div 
                className="absolute w-24 h-24 border-2 border-purple-400 bg-purple-600 bg-opacity-30"
                style={{ transform: 'rotateX(90deg) translateZ(12px)' }}
              ></div>
              
              {/* Bottom face */}
              <div 
                className="absolute w-24 h-24 border-2 border-purple-400 bg-purple-800 bg-opacity-10"
                style={{ transform: 'rotateX(-90deg) translateZ(12px)' }}
              ></div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-lg bg-purple-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
            
            {/* Corner accent lines */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-purple-500"></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-purple-500"></div>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-purple-500"></div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-purple-500"></div>
          </div>
        </div>
        
        {/* Get Started button */}
        <a href="/Projects" className="text-purple-400 text-2xl font-thin tracking-wider hover:text-purple-300 transition-colors duration-300 border border-purple-500 border-opacity-30 px-8 py-3 rounded hover:border-opacity-50">
          GET STARTED
        </a>
      </div>
      
      {/* Additional subtle grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-900 to-transparent opacity-30"></div>
        <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-900 to-transparent opacity-30"></div>
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-900 to-transparent opacity-30"></div>
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-900 to-transparent opacity-30"></div>
      </div>
    </div>
  );
};

export default Home;