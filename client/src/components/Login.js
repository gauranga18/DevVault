import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';
import { LogIn, Shield, Code, Database } from 'lucide-react';

const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Show nothing while Auth0 is loading
  if (isLoading) return null;

  // If already authenticated, redirect to the page user came from
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              DevVault
            </h1>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-gray-400">
            Secure your development workflow with our all-in-one platform
          </p>
        </div>

        <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-300">
              <Code className="w-5 h-5 mr-3 text-purple-400" />
              <span>Manage your projects</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Database className="w-5 h-5 mr-3 text-purple-400" />
              <span>Store passwords securely</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Shield className="w-5 h-5 mr-3 text-purple-400" />
              <span>Keep notes organized</span>
            </div>
          </div>

          <button
            onClick={() => loginWithRedirect({ appState: { returnTo: from } })}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-all duration-200 shadow-md shadow-purple-500/30 flex items-center justify-center"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login / Sign Up
          </button>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Secure authentication powered by Auth0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
