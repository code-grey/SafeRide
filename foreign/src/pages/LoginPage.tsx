import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ParticleBackground from '../components/ParticleBackground';

const LoginPage = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd have validation and an API call here
    login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-background text-white flex items-center justify-center relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground theme={theme} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80 z-0"></div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">SAFERIDE</h1>
          </Link>
          <p className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase">Access Portal</p>
        </div>

        {/* Form Card */}
        <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-8 relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent-blue/30"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent-blue/30"></div>

          <h2 className="text-2xl font-light tracking-tight mb-8 text-center">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-black/50 text-white border border-white/20 px-4 py-3 leading-tight focus:outline-none focus:border-accent-blue transition-colors duration-300"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-black/50 text-white border border-white/20 px-4 py-3 leading-tight focus:outline-none focus:border-accent-blue transition-colors duration-300"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-transparent border-2 border-accent-blue text-accent-blue font-medium py-3 px-6 uppercase tracking-widest hover:bg-accent-blue hover:text-black transition-all duration-300 mt-8"
            >
              Access System
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-3 text-center text-sm">
            <div>
              <Link to="/forgot-password" className="text-gray-400 hover:text-accent-blue transition-colors font-light">
                Forgot password?
              </Link>
            </div>
            <div className="pt-4 border-t border-white/10">
              <span className="text-gray-500 font-light">New to SafeRide? </span>
              <Link to="/register" className="text-accent-blue hover:text-white transition-colors font-medium">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-gray-500 hover:text-white transition-colors text-sm font-light">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
