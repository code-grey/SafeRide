import React, { useState } from 'react';
import { FaCoins, FaUtensils, FaGasPump, FaCoffee, FaStar, FaTrophy } from 'react-icons/fa';

interface Partner {
    id: string;
    name: string;
    category: 'restaurant' | 'fuel' | 'cafe';
    icon: any;
    tokensRequired: number;
    discount: string;
    description: string;
}

const RewardsPage = () => {
    const [tokenBalance] = useState(2450);
    const [safetyScore] = useState(92);

    const partners: Partner[] = [
        {
            id: '1',
            name: 'McDonald\'s',
            category: 'restaurant',
            icon: FaUtensils,
            tokensRequired: 500,
            discount: '$10 OFF',
            description: 'Redeem at any McDonald\'s location'
        },
        {
            id: '2',
            name: 'Shell Gas Station',
            category: 'fuel',
            icon: FaGasPump,
            tokensRequired: 1000,
            discount: '$20 OFF',
            description: 'Fuel discount at Shell stations'
        },
        {
            id: '3',
            name: 'Starbucks',
            category: 'cafe',
            icon: FaCoffee,
            tokensRequired: 300,
            discount: '$5 OFF',
            description: 'Coffee and beverages discount'
        },
        {
            id: '4',
            name: 'BP Fuel',
            category: 'fuel',
            icon: FaGasPump,
            tokensRequired: 800,
            discount: '$15 OFF',
            description: 'Fuel discount at BP stations'
        },
        {
            id: '5',
            name: 'Subway',
            category: 'restaurant',
            icon: FaUtensils,
            tokensRequired: 400,
            discount: '$8 OFF',
            description: 'Fresh sandwiches and salads'
        },
        {
            id: '6',
            name: 'Dunkin\'',
            category: 'cafe',
            icon: FaCoffee,
            tokensRequired: 250,
            discount: '$5 OFF',
            description: 'Donuts and coffee discount'
        },
    ];

    const handleRedeem = (partner: Partner) => {
        if (tokenBalance >= partner.tokensRequired) {
            alert(`Redeemed ${partner.tokensRequired} tokens at ${partner.name}! You received ${partner.discount}.`);
        } else {
            alert(`Insufficient tokens. You need ${partner.tokensRequired - tokenBalance} more tokens.`);
        }
    };

    return (
        <div className="min-h-screen bg-dark-background text-white p-6 md:p-8">
            {/* Header */}
            <div className="mb-12">
                <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Loyalty Program</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight">Rewards & Tokens</h1>
            </div>

            {/* Token Balance & Safety Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 md:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <FaCoins className="text-yellow-500 text-4xl" />
                        <span className="text-gray-400 font-mono text-xs uppercase">Token Balance</span>
                    </div>
                    <div className="text-5xl font-light text-yellow-500">{tokenBalance.toLocaleString()}</div>
                    <p className="text-gray-400 text-sm font-light mt-2">SafeRide Tokens</p>
                </div>

                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <FaStar className="text-accent-blue text-4xl" />
                        <span className="text-gray-400 font-mono text-xs uppercase">Safety Score</span>
                    </div>
                    <div className="text-5xl font-light text-accent-blue">{safetyScore}</div>
                    <p className="text-gray-400 text-sm font-light mt-2">Current Rating</p>
                </div>

                <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <FaTrophy className="text-green-500 text-4xl" />
                        <span className="text-gray-400 font-mono text-xs uppercase">Tokens Earned</span>
                    </div>
                    <div className="text-5xl font-light text-green-500">+150</div>
                    <p className="text-gray-400 text-sm font-light mt-2">This Month</p>
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 mb-12">
                <h2 className="text-2xl font-light tracking-tight mb-4">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">01 // Earn</div>
                        <p className="text-gray-300 font-light">Drive safely and maintain a high safety score to earn tokens automatically</p>
                    </div>
                    <div>
                        <div className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">02 // Accumulate</div>
                        <p className="text-gray-300 font-light">Tokens are added to your balance after each verified safe trip</p>
                    </div>
                    <div>
                        <div className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">03 // Redeem</div>
                        <p className="text-gray-300 font-light">Use tokens at our partner restaurants, fuel stations, and cafes</p>
                    </div>
                </div>
            </div>

            {/* Partner Redemption Options */}
            <div>
                <h2 className="text-2xl font-light tracking-tight mb-6">Partner Locations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((partner) => {
                        const Icon = partner.icon;
                        const canRedeem = tokenBalance >= partner.tokensRequired;

                        return (
                            <div key={partner.id} className="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 hover:border-accent-blue/50 transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <Icon className={`text-4xl ${partner.category === 'restaurant' ? 'text-orange-500' :
                                            partner.category === 'fuel' ? 'text-red-500' :
                                                'text-brown-500'
                                        }`} />
                                    <span className={`font-mono text-xs uppercase px-3 py-1 border ${canRedeem
                                            ? 'border-green-500 text-green-500'
                                            : 'border-gray-600 text-gray-600'
                                        }`}>
                                        {partner.tokensRequired} tokens
                                    </span>
                                </div>

                                <h3 className="text-xl font-medium mb-2">{partner.name}</h3>
                                <p className="text-gray-400 text-sm font-light mb-4">{partner.description}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-light text-accent-blue">{partner.discount}</span>
                                </div>

                                <button
                                    onClick={() => handleRedeem(partner)}
                                    disabled={!canRedeem}
                                    className={`w-full py-3 px-6 uppercase tracking-widest font-medium transition-all duration-300 ${canRedeem
                                            ? 'bg-transparent border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-black'
                                            : 'bg-gray-800 border-2 border-gray-700 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    {canRedeem ? 'Redeem Now' : 'Insufficient Tokens'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RewardsPage;
