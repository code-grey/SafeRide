import React from 'react';

const IncidentAlert: React.FC = () => {
  return (
    <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg shadow-lg animate-pulse mt-8">
      <div className="flex flex-col sm:flex-row items-center">
        <svg className="w-8 h-8 mb-3 sm:mb-0 sm:mr-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-md sm:text-lg">Immediate Incident Alert!</h4>
          <p className="text-xs sm:text-sm">Potential collision detected. Capturing data...</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentAlert;
