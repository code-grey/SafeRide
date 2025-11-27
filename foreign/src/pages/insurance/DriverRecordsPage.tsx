import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

interface Driver {
    id: string;
    name: string;
    safetyScore: number;
    totalTrips: number;
    incidents: number;
    status: 'active' | 'inactive';
}

const DriverRecordsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data
    const drivers: Driver[] = [
        { id: 'D001', name: 'John Doe', safetyScore: 92, totalTrips: 145, incidents: 2, status: 'active' },
        { id: 'D002', name: 'Jane Smith', safetyScore: 88, totalTrips: 203, incidents: 5, status: 'active' },
        { id: 'D003', name: 'Mike Johnson', safetyScore: 65, totalTrips: 89, incidents: 12, status: 'active' },
        { id: 'D004', name: 'Sarah Williams', safetyScore: 95, totalTrips: 267, incidents: 1, status: 'active' },
    ];

    return (
        <div className="min-h-screen bg-dark-background text-white p-6 md:p-8">
            {/* Header */}
            <div className="mb-12">
                <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Driver Management</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight">Driver Records</h1>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search drivers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-surface/50 text-white border border-white/20 pl-12 pr-4 py-3 leading-tight focus:outline-none focus:border-accent-blue transition-colors duration-300"
                    />
                </div>
            </div>

            {/* Drivers Table */}
            <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Driver ID</th>
                                <th className="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Name</th>
                                <th className="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Safety Score</th>
                                <th className="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Total Trips</th>
                                <th className="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Incidents</th>
                                <th className="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Status</th>
                                <th className="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver) => (
                                <tr key={driver.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-accent-blue">{driver.id}</td>
                                    <td className="p-4">{driver.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            {driver.safetyScore >= 80 ? (
                                                <FaCheckCircle className="text-green-500 mr-2" />
                                            ) : (
                                                <FaExclamationTriangle className="text-yellow-500 mr-2" />
                                            )}
                                            <span className={driver.safetyScore >= 80 ? 'text-green-500' : 'text-yellow-500'}>
                                                {driver.safetyScore}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">{driver.totalTrips}</td>
                                    <td className="p-4">{driver.incidents}</td>
                                    <td className="p-4">
                                        <span className={`font-mono text-xs uppercase ${driver.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                                            {driver.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-accent-blue hover:text-white transition-colors text-sm font-medium">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DriverRecordsPage;
