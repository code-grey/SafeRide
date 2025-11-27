import React from 'react';
import { FaCube, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface TripRecordProps {
  record: {
    id: string;
    startTime: string;
    endTime: string;
    distance: string;
    safetyScore: number;
    incidents: number;
    isVerified: boolean;
    hash: string;
  };
}

const TripRecord: React.FC<TripRecordProps> = ({ record }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 shadow-md transition-all duration-300">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div>
          <p className="text-lg font-semibold text-white">Trip ID: {record.id}</p>
          <p className="text-sm text-gray-400">{record.startTime} - {record.endTime}</p>
        </div>
        <div className="flex items-center">
          {record.isVerified ? (
            <FaCheckCircle className="text-green-500 mr-2" />
          ) : (
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
          )}
          <span className={`px-2 py-1 text-xs rounded-full ${record.safetyScore > 85 ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
            Score: {record.safetyScore}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-300"><span className="font-semibold text-white">Distance:</span> {record.distance}</p>
          <p className="text-sm text-gray-300"><span className="font-semibold text-white">Incidents:</span> {record.incidents}</p>
          <div className="mt-2 text-xs text-gray-500 break-all">
            <FaCube className="inline mr-2" />
            <span className="font-mono">Hash: {record.hash}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripRecord;
