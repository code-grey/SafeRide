import React from 'react';
import { FaHeartbeat, FaEye, FaBrain, FaThermometerHalf, FaMicrochip, FaWifi } from 'react-icons/fa';

interface Device {
    id: string;
    name: string;
    category: 'wearable' | 'sensor' | 'iot';
    icon: any;
    description: string;
    specs: string[];
    status: 'active' | 'inactive';
}

const DevicesPage = () => {
    const devices: Device[] = [
        {
            id: '1',
            name: 'Smart Wearable Band',
            category: 'wearable',
            icon: FaHeartbeat,
            description: 'Advanced health monitoring wristband for real-time vital signs tracking',
            specs: [
                'Heart Rate Monitor (BPM)',
                'Blood Oxygen Level (SpO2)',
                'Skin Temperature Sensor',
                'Accelerometer for Movement',
                'Battery Life: 7 days',
                'Bluetooth 5.0 Connectivity'
            ],
            status: 'active'
        },
        {
            id: '2',
            name: 'Eye Tracking Camera',
            category: 'sensor',
            icon: FaEye,
            description: 'AI-powered camera system for drowsiness and distraction detection',
            specs: [
                'Infrared Eye Tracking',
                'Blink Rate Detection',
                'Gaze Direction Analysis',
                'Drowsiness Alert System',
                '60 FPS Processing',
                'Night Vision Capable'
            ],
            status: 'active'
        },
        {
            id: '3',
            name: 'EEG Headband',
            category: 'wearable',
            icon: FaBrain,
            description: 'Brainwave monitoring headband for cognitive load and fatigue detection',
            specs: [
                '4-Channel EEG Sensors',
                'Real-time Brain Activity',
                'Fatigue Level Detection',
                'Stress Monitoring',
                'Wireless Data Transfer',
                'Comfortable Fit Design'
            ],
            status: 'active'
        },
        {
            id: '4',
            name: 'Cabin Environment Sensor',
            category: 'iot',
            icon: FaThermometerHalf,
            description: 'Multi-sensor module for monitoring cabin conditions',
            specs: [
                'Temperature Monitoring',
                'Humidity Sensor',
                'CO2 Level Detection',
                'Air Quality Index',
                'Light Level Sensor',
                'WiFi Connectivity'
            ],
            status: 'active'
        },
        {
            id: '5',
            name: 'Vehicle OBD-II Adapter',
            category: 'iot',
            icon: FaMicrochip,
            description: 'On-board diagnostics adapter for vehicle performance monitoring',
            specs: [
                'Engine Performance Data',
                'Speed & Acceleration',
                'Fuel Consumption',
                'Diagnostic Trouble Codes',
                'Real-time Vehicle Stats',
                'Bluetooth/WiFi Enabled'
            ],
            status: 'active'
        },
        {
            id: '6',
            name: 'Edge Computing Hub',
            category: 'iot',
            icon: FaWifi,
            description: 'Central processing unit for local data analysis and cloud sync',
            specs: [
                'ARM Cortex Processor',
                'Local AI Processing',
                '4G/5G Connectivity',
                'GPS Module',
                'Secure Data Encryption',
                'Cloud Synchronization'
            ],
            status: 'active'
        }
    ];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'wearable':
                return 'text-purple-500';
            case 'sensor':
                return 'text-blue-500';
            case 'iot':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    const getCategoryBorder = (category: string) => {
        switch (category) {
            case 'wearable':
                return 'border-purple-500';
            case 'sensor':
                return 'border-blue-500';
            case 'iot':
                return 'border-green-500';
            default:
                return 'border-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-dark-background text-white p-6 md:p-8">
            {/* Header */}
            <div className="mb-12">
                <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Hardware Ecosystem</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">IoT Devices & Sensors</h1>
                <p className="text-gray-400 font-light max-w-3xl">
                    SafeRide uses a comprehensive suite of IoT devices, sensors, and wearables to monitor driver wellness in real-time.
                    Our hardware ecosystem ensures accurate data collection for AI-powered safety analysis.
                </p>
            </div>

            {/* Device Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-purple-500/30 p-6">
                    <div className="text-purple-500 font-mono text-xs tracking-[0.2em] uppercase mb-2">Wearables</div>
                    <div className="text-3xl font-light">2 Devices</div>
                    <p className="text-gray-400 text-sm font-light mt-2">Body-worn sensors for health monitoring</p>
                </div>
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-blue-500/30 p-6">
                    <div className="text-blue-500 font-mono text-xs tracking-[0.2em] uppercase mb-2">Sensors</div>
                    <div className="text-3xl font-light">1 Device</div>
                    <p className="text-gray-400 text-sm font-light mt-2">Advanced detection systems</p>
                </div>
                <div className="bg-dark-surface/50 backdrop-blur-xl border border-green-500/30 p-6">
                    <div className="text-green-500 font-mono text-xs tracking-[0.2em] uppercase mb-2">IoT Modules</div>
                    <div className="text-3xl font-light">3 Devices</div>
                    <p className="text-gray-400 text-sm font-light mt-2">Connected monitoring systems</p>
                </div>
            </div>

            {/* Devices Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {devices.map((device) => {
                    const Icon = device.icon;

                    return (
                        <div key={device.id} className={`bg-dark-surface/50 backdrop-blur-xl border ${getCategoryBorder(device.category)}/30 p-6 hover:border-accent-blue/50 transition-all duration-300`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <Icon className={`text-4xl ${getCategoryColor(device.category)} mr-4`} />
                                    <div>
                                        <h3 className="text-xl font-medium">{device.name}</h3>
                                        <span className={`font-mono text-xs uppercase ${getCategoryColor(device.category)}`}>
                                            {device.category}
                                        </span>
                                    </div>
                                </div>
                                <span className={`font-mono text-xs uppercase px-3 py-1 border ${device.status === 'active'
                                        ? 'border-green-500 text-green-500'
                                        : 'border-gray-600 text-gray-600'
                                    }`}>
                                    {device.status}
                                </span>
                            </div>

                            <p className="text-gray-300 mb-4 font-light">{device.description}</p>

                            <div className="border-t border-white/10 pt-4">
                                <div className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-3">Specifications</div>
                                <ul className="space-y-2">
                                    {device.specs.map((spec, index) => (
                                        <li key={index} className="flex items-start text-sm">
                                            <span className="text-accent-blue mr-2">•</span>
                                            <span className="text-gray-400 font-light">{spec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* System Architecture */}
            <div className="mt-12 bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <h2 className="text-2xl font-light tracking-tight mb-6">System Architecture</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">01 // Collect</div>
                        <p className="text-gray-300 font-light text-sm">Sensors gather real-time data from driver and vehicle</p>
                    </div>
                    <div className="text-center">
                        <div className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">02 // Process</div>
                        <p className="text-gray-300 font-light text-sm">Edge computing hub analyzes data locally using AI</p>
                    </div>
                    <div className="text-center">
                        <div className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">03 // Sync</div>
                        <p className="text-gray-300 font-light text-sm">Encrypted data transmitted to blockchain network</p>
                    </div>
                    <div className="text-center">
                        <div className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">04 // Alert</div>
                        <p className="text-gray-300 font-light text-sm">Real-time alerts sent to driver and fleet manager</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevicesPage;
