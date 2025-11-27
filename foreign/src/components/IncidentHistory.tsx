import React, { useState, useEffect } from 'react';
import incidentsData from '../data/incidents.json';

interface Incident {
  id: number;
  type: string;
  timestamp: string;
  details: string;
}

const IncidentHistory: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setIncidents(incidentsData);
  }, []);

  return (
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Incident History</h3>
      {/* Table for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => (
              <tr key={incident.id} className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800/40' : 'bg-gray-900/40'}`}>
                <td className="px-4 py-2">{incident.id}</td>
                <td className="px-4 py-2">{incident.type}</td>
                <td className="px-4 py-2">{incident.timestamp}</td>
                <td className="px-4 py-2">{incident.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4">
        {incidents.map(incident => (
          <div key={incident.id} className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white">{incident.type}</span>
              <span className="text-xs text-gray-400">ID: {incident.id}</span>
            </div>
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold">Timestamp:</span> {incident.timestamp}</p>
            <p className="text-sm text-gray-300"><span className="font-semibold">Details:</span> {incident.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentHistory;
