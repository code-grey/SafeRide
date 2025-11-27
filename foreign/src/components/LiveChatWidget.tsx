import React, { useState } from 'react';
import { FaCommentDots, FaPaperPlane, FaTimes } from 'react-icons/fa';

const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-800 w-80 h-96 rounded-lg shadow-2xl flex flex-col transition-all duration-300">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gray-700 rounded-t-lg">
            <h3 className="text-white font-semibold">Live Support</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <FaTimes />
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto text-sm">
            <div className="mb-4">
              <p className="bg-blue-600 text-white rounded-lg py-2 px-3 inline-block">Welcome to SafeRide! How can we help you today?</p>
            </div>
            <div className="mb-4 text-right">
              <p className="bg-gray-600 text-white rounded-lg py-2 px-3 inline-block">I have a question about my policy.</p>
            </div>
          </div>
          {/* Input */}
          <div className="p-4 bg-gray-700 rounded-b-lg">
            <div className="flex items-center">
              <input type="text" placeholder="Type your message..." className="w-full bg-gray-600 border-gray-500 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="ml-3 text-blue-400 hover:text-blue-500">
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform duration-300 hover:scale-110"
          aria-label="Open live chat"
        >
          <FaCommentDots className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default LiveChatWidget;
