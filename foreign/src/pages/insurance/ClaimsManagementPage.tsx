import React from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface Claim {
    id: string;
    driverId: string;
    driverName: string;
    date: string;
    amount: string;
    status: 'pending' | 'approved' | 'rejected';
    description: string;
}

const ClaimsManagementPage = () => {
    // Mock data
    const claims: Claim[] = [
        {
            id: 'CLM001',
            driverId: 'D001',
            driverName: 'John Doe',
            date: '2024-01-15',
            amount: '$2,500',
            status: 'pending',
            description: 'Minor collision - rear bumper damage'
        },
        {
            id: 'CLM002',
            driverId: 'D003',
            driverName: 'Mike Johnson',
            date: '2024-01-14',
            amount: '$5,200',
            status: 'pending',
            description: 'Side panel damage from parking incident'
        },
        {
            id: 'CLM003',
            driverId: 'D002',
            driverName: 'Jane Smith',
            date: '2024-01-10',
            amount: '$1,800',
            status: 'approved',
            description: 'Windshield replacement'
        },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <FaClock className="text-yellow-500" />;
            case 'approved':
                return <FaCheckCircle className="text-green-500" />;
            case 'rejected':
                return <FaTimesCircle className="text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-500';
            case 'approved':
                return 'text-green-500';
            case 'rejected':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-dark-background text-white p-6 md:p-8">
            {/* Header */}
            <div className="mb-12">
                <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Claims Processing</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight">Claims Management</h1>
            </div>

            {/* Claims List */}
            <div className="space-y-6">
                {claims.map((claim) => (
                    <div key={claim.id} className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="mr-4">{getStatusIcon(claim.status)}</div>
                                <div>
                                    <h3 className="text-xl font-medium">Claim {claim.id}</h3>
                                    <p className="text-gray-400 text-sm font-light">
                                        Driver: {claim.driverName} ({claim.driverId})
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-light mb-1">{claim.amount}</div>
                                <span className={`font-mono text-xs uppercase ${getStatusColor(claim.status)}`}>
                                    {claim.status}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mb-4">
                            <p className="text-gray-300 mb-2">{claim.description}</p>
                            <p className="text-gray-500 text-sm font-light">Filed: {claim.date}</p>
                        </div>

                        {claim.status === 'pending' && (
                            <div className="flex space-x-4">
                                <button className="flex-1 bg-green-500/20 border border-green-500 text-green-500 font-medium py-2 px-4 uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all duration-300">
                                    Approve
                                </button>
                                <button className="flex-1 bg-red-500/20 border border-red-500 text-red-500 font-medium py-2 px-4 uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all duration-300">
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClaimsManagementPage;
