import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaBell, FaLock, FaMoon, FaSun } from 'react-icons/fa';

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);

    return (
        <div className="min-h-screen bg-dark-background text-white p-6 md:p-8">
            {/* Header */}
            <div className="mb-12">
                <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">System Configuration</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight">Settings</h1>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8 max-w-4xl">
                {/* Profile Settings */}
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center mb-6">
                        <FaUser className="text-accent-blue text-xl mr-3" />
                        <h2 className="text-2xl font-light tracking-tight">Profile</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="w-full bg-black/50 text-white border border-white/20 px-4 py-3 leading-tight focus:outline-none focus:border-accent-blue transition-colors duration-300"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full bg-black/50 text-white border border-white/20 px-4 py-3 leading-tight focus:outline-none focus:border-accent-blue transition-colors duration-300"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center mb-6">
                        {theme === 'dark' ? (
                            <FaMoon className="text-accent-blue text-xl mr-3" />
                        ) : (
                            <FaSun className="text-accent-blue text-xl mr-3" />
                        )}
                        <h2 className="text-2xl font-light tracking-tight">Appearance</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Dark Mode</p>
                            <p className="text-gray-400 text-sm font-light">Toggle between light and dark themes</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-accent-blue' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center mb-6">
                        <FaBell className="text-accent-blue text-xl mr-3" />
                        <h2 className="text-2xl font-light tracking-tight">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Push Notifications</p>
                                <p className="text-gray-400 text-sm font-light">Receive alerts for safety events</p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${notifications ? 'bg-accent-blue' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Email Alerts</p>
                                <p className="text-gray-400 text-sm font-light">Get email summaries of your trips</p>
                            </div>
                            <button
                                onClick={() => setEmailAlerts(!emailAlerts)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${emailAlerts ? 'bg-accent-blue' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${emailAlerts ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center mb-6">
                        <FaLock className="text-accent-blue text-xl mr-3" />
                        <h2 className="text-2xl font-light tracking-tight">Security</h2>
                    </div>
                    <button className="w-full bg-transparent border-2 border-accent-blue text-accent-blue font-medium py-3 px-6 uppercase tracking-widest hover:bg-accent-blue hover:text-black transition-all duration-300">
                        Change Password
                    </button>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button className="bg-accent-blue text-black font-medium py-3 px-8 uppercase tracking-widest hover:bg-accent-blue/80 transition-all duration-300">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
