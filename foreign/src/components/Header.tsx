import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import { useMobileMenu } from '../context/MobileMenuContext';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaEnvelope, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Header: React.FC = () => {
  const { toggleMenu } = useMobileMenu();
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const mockMessages = [
    { id: 1, from: 'Fleet Manager', message: 'Great job on maintaining your safety score!', time: '1h ago', unread: true },
    { id: 2, from: 'System', message: 'Your monthly report is ready', time: '3h ago', unread: true },
    { id: 3, from: 'Support', message: 'Thank you for your feedback', time: '1d ago', unread: false },
  ];

  const unreadCount = mockMessages.filter(m => m.unread).length;

  return (
    <header className="bg-dark-surface/50 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center">
      {/* Hamburger Menu Button - visible only on md and smaller screens */}
      <button onClick={toggleMenu} className="md:hidden text-gray-400 hover:text-accent-blue transition-colors">
        <FaBars className="w-6 h-6" />
      </button>

      {/* Right Side - Notifications, Messages, Profile */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Messages */}
        <div className="relative">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="relative text-gray-400 hover:text-accent-blue transition-colors focus:outline-none"
          >
            <FaEnvelope className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-accent-blue rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-dark-surface border border-white/10 rounded-lg shadow-xl z-20">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-medium text-white">Messages</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {mockMessages.map(msg => (
                  <div key={msg.id} className={`p-4 hover:bg-white/5 transition-colors border-b border-white/10 ${msg.unread ? 'bg-accent-blue/5' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-medium text-white">{msg.from}</p>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-400">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/10 text-center">
                <button className="text-accent-blue text-sm hover:text-white transition-colors">View All Messages</button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationCenter />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 text-gray-400 hover:text-accent-blue transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue flex items-center justify-center">
              <FaUser className="w-4 h-4 text-accent-blue" />
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-dark-surface border border-white/10 rounded-lg shadow-xl z-20">
              <div className="p-4 border-b border-white/10">
                <p className="text-white font-medium">John Doe</p>
                <p className="text-gray-400 text-sm">john@example.com</p>
              </div>
              <div className="py-2">
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <FaCog className="w-4 h-4 mr-3" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
