import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaFileInvoiceDollar, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useMobileMenu } from '../context/MobileMenuContext';

const InsuranceSidebar: React.FC = () => {
    const { isMenuOpen, toggleMenu } = useMobileMenu();

    const handleLogout = () => {
        // Navigate to insurance login
        window.location.href = '/insurance-portal/login';
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
                    <p className="text-accent-blue font-mono text-[10px] tracking-widest uppercase">Insurance</p>
                </div>
                <button onClick={toggleMenu} className="md:hidden text-gray-400 hover:text-white focus:outline-none">
                    <FaTimes className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-6 space-y-1">
                <NavLink to="/insurance-portal/dashboard" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
                    <FaTachometerAlt className="w-5 h-5" />
                    <span className="mx-4 font-medium tracking-wide">Dashboard</span>
                </NavLink>
                <NavLink to="/insurance-portal/drivers" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
                    <FaUsers className="w-5 h-5" />
                    <span className="mx-4 font-medium tracking-wide">Driver Records</span>
                </NavLink>
                <NavLink to="/insurance-portal/claims" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
                    <FaFileInvoiceDollar className="w-5 h-5" />
                    <span className="mx-4 font-medium tracking-wide">Claims</span>
                </NavLink>
            </nav>

            {/* Bottom Actions */}
            <div className="px-2 py-4 border-t border-white/10 space-y-1">
                <NavLink to="/insurance-portal/settings" className={navLinkClasses} onClick={isMenuOpen ? toggleMenu : undefined}>
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

export default InsuranceSidebar;
