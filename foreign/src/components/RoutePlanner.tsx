import React from 'react';
import { FaMapMarkerAlt, FaRoute } from 'react-icons/fa';

const RoutePlanner: React.FC = () => {
  return (
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Route Planner</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-gray-900 rounded-lg h-64 lg:h-auto flex items-center justify-center">
          <FaMapMarkerAlt className="text-gray-500 text-6xl" />
          <p className="text-gray-500 ml-4">Map API Placeholder</p>
        </div>

        {/* Route Controls */}
        <div className="lg:col-span-1">
          <form>
            <div className="mb-4">
              <label htmlFor="start" className="block text-sm font-medium text-gray-300 mb-2">Starting Point</label>
              <input type="text" id="start" name="start" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., City Hall" />
            </div>
            <div className="mb-4">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
              <input type="text" id="destination" name="destination" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Central Station" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition duration-300">
              <FaRoute className="mr-2" />
              <span>Plan Route</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
