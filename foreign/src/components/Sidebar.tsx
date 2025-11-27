import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaShieldAlt, FaCube, FaCog, FaFlag, FaTimes, FaSignOutAlt, FaCoins, FaMicrochip } from 'react-icons/fa';
import { useFeedback } from '../context/FeedbackContext';
import { useMobileMenu } from '../context/MobileMenuContext';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { openModal } = useFeedback();
  const { isMenuOpen, toggleMenu } = useMobileMenu();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-gray-400 transition-all duration-200 border-l-2 ${isActive
      ? 'border-accent-blue text-accent-blue bg-white/5'
      : 'border-transparent hover:border-accent-blue/50 hover:text-white hover:bg-white/5'
    }`;

  const buttonClasses = "flex items-center w-full px-4 py-3 text-gray-400 transition-all duration-200 border-l-2 border-transparent hover:border-accent-blue/50 hover:text-white hover:bg-white/5";

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-dark-surface border-r border-white/10 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-white">SAFERIDE</h2>
          <p className="text-accent-blue font-mono text-[10px] tracking-widest uppercase">System</p>
        </div>
        <button onClick={toggleMenu} className="md:hidden text-gray-400 hover:text-white focus:outline-none">
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1">
        <NavLink to="/dashboard" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
          <FaTachometerAlt className="w-5 h-5" />
          <span className="mx-4 font-medium tracking-wide">Dashboard</span>
        </NavLink>
        <NavLink to="/insurance" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
          <FaShieldAlt className="w-5 h-5" />
          <span className="mx-4 font-medium tracking-wide">Insurance</span>
        </NavLink>
        <NavLink to="/blockchain" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
          <FaCube className="w-5 h-5" />
          <span className="mx-4 font-medium tracking-wide">Blockchain</span>
        </NavLink>
        <NavLink to="/devices" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
          <FaMicrochip className="w-5 h-5" />
          <span className="mx-4 font-medium tracking-wide">Devices</span>
        </NavLink>
        <NavLink to="/rewards" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
          <FaCoins className="w-5 h-5" />
          <span className="mx-4 font-medium tracking-wide">Rewards</span>
        </NavLink>
      </nav>

      {/* Bottom Actions */}
      <div className="px-2 py-4 border-t border-white/10 space-y-1">
        <button onClick={() => { openModal(); if (isMenuOpen) toggleMenu(); }} className={buttonClasses}>
          <FaFlag className="w-5 h-5" />
          <span className="mx-4 font-medium tracking-wide">Feedback</span>
        </button>
        <NavLink to="/settings" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
          <FaCog className="w-5 h-5" />
          <span className="mx-4 font-medium tracking-wide">Settings</span>
        </NavLink>
        <button onClick={handleLogout} className={buttonClasses}>
          <FaSignOutAlt className="w-5 h-5" />
          <span className="mx-4 font-medium tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
