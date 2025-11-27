import React from 'react';
import { FaUsers, FaShieldAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const InsuranceDashboardPage = () => {
    return (
        <div className="min-h-screen bg-dark-background text-white p-6 md:p-8">
            {/* Header */}
            <div className="mb-12">
                <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Insurance Portal</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight">Dashboard Overview</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <FaUsers className="text-accent-blue text-3xl" />
                        <span className="text-gray-400 font-mono text-xs uppercase">Total Drivers</span>
                    </div>
                    <div className="text-4xl font-light">1,247</div>
                </div>

                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <FaShieldAlt className="text-green-500 text-3xl" />
                        <span className="text-gray-400 font-mono text-xs uppercase">Active Policies</span>
                    </div>
                    <div className="text-4xl font-light">1,089</div>
                </div>

                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <FaExclamationTriangle className="text-yellow-500 text-3xl" />
                        <span className="text-gray-400 font-mono text-xs uppercase">Pending Claims</span>
                    </div>
                    <div className="text-4xl font-light">23</div>
                </div>

                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <FaCheckCircle className="text-accent-blue text-3xl" />
                        <span className="text-gray-400 font-mono text-xs uppercase">Avg Safety Score</span>
                    </div>
                    <div className="text-4xl font-light">87.3</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Claims */}
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <h2 className="text-2xl font-light tracking-tight mb-6">Recent Claims</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                                <div>
                                    <p className="text-white font-medium">Claim #{1000 + i}</p>
                                    <p className="text-gray-400 text-sm font-light">Driver: John Doe</p>
                                </div>
                                <span className="text-yellow-500 font-mono text-xs uppercase">Pending</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* High Risk Drivers */}
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <h2 className="text-2xl font-light tracking-tight mb-6">High Risk Alerts</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                                <div>
                                    <p className="text-white font-medium">Driver #{5000 + i}</p>
                                    <p className="text-gray-400 text-sm font-light">Safety Score: {65 - i * 5}</p>
                                </div>
                                <span className="text-red-500 font-mono text-xs uppercase">High Risk</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsuranceDashboardPage;
