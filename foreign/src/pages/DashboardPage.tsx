import React from 'react';
import WellnessWidget from '../components/WellnessWidget';
import { FaBed, FaBolt, FaHeartbeat } from 'react-icons/fa';
import IncidentAlert from '../components/IncidentAlert';
import IncidentHistory from '../components/IncidentHistory';
import RoutePlanner from '../components/RoutePlanner';
import { useTheme } from '../context/ThemeContext';
import ParticleBackground from '../components/ParticleBackground';

const DashboardPage = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-dark-background text-white relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <ParticleBackground theme={theme} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">System Dashboard</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">Driver Wellness Monitor</h1>
        </div>

        {/* Wellness Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <WellnessWidget
            icon={FaBed}
            label="Fatigue Level"
            value="Low"
            color="text-green-500"
          />
          <WellnessWidget
            icon={FaBolt}
            label="Alertness"
            value="High"
            color="text-green-500"
          />
          <WellnessWidget
            icon={FaHeartbeat}
            label="Health Stats"
            value="Normal"
            color="text-green-500"
          />
        </div>

        {/* Incident Management */}
        <div className="space-y-8 mb-12">
          <div>
            <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-4">Incident Management</span>
            <IncidentAlert />
          </div>
          <IncidentHistory />
        </div>

        {/* Route Planner */}
        <div>
          <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-4">Route Planning</span>
          <RoutePlanner />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
