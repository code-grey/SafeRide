import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';

const mockNotifications = [
  { id: 1, message: 'Your weekly safety report is ready.', time: '2h ago', type: 'info' },
  { id: 2, message: 'High fatigue detected - take a break!', time: '5h ago', type: 'warning' },
  { id: 3, message: 'You earned 50 tokens for safe driving!', time: '1d ago', type: 'success' },
];

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-400 hover:text-accent-blue transition-colors focus:outline-none"
      >
        <FaBell className="w-6 h-6" />
        {mockNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-accent-blue rounded-full">
            {mockNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-dark-surface border border-white/10 rounded-lg shadow-xl z-20">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {mockNotifications.map(notification => (
              <div key={notification.id} className="p-4 hover:bg-white/5 transition-colors border-b border-white/10 last:border-0">
                <p className="text-sm text-gray-300">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10 text-center">
            <button className="text-accent-blue text-sm hover:text-white transition-colors">View All Notifications</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
