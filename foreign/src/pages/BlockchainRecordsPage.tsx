import React, { useState, useEffect } from 'react';
import TripRecord from '../components/TripRecord';
import tripsData from '../data/trips.json';

interface Trip {
  id: string;
  startTime: string;
  endTime: string;
  distance: string;
  safetyScore: number;
  incidents: number;
  isVerified: boolean;
  hash: string;
}

const BlockchainRecordsPage: React.FC = () => {
  const [tripRecords, setTripRecords] = useState<Trip[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setTripRecords(tripsData);
  }, []);

  return (
    <div className="min-h-screen bg-dark-background text-white p-6 md:p-8">
      {/* Header */}
      <div className="mb-12">
        <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Blockchain Ledger</span>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Trip History</h1>
        <p className="text-gray-400 font-light max-w-3xl">
          Review your tamper-proof trip records. Each record is cryptographically signed and stored on the blockchain for ultimate transparency and trust.
        </p>
      </div>

      {/* Trip Records */}
      <div className="space-y-4">
        {tripRecords.map(record => (
          <TripRecord key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
};

export default BlockchainRecordsPage;
