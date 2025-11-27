import React, { useState } from 'react';
import { FaTimes, FaLightbulb, FaBug } from 'react-icons/fa';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState<'idea' | 'bug'>('idea');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      feedbackType,
      title,
      description
    });
    // Reset form and close modal
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Submit Feedback</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-2 text-sm font-medium ${feedbackType === 'idea' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
              onClick={() => setFeedbackType('idea')}
            >
              <FaLightbulb className="inline mr-2" /> Idea
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${feedbackType === 'bug' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
              onClick={() => setFeedbackType('bug')}
            >
              <FaBug className="inline mr-2" /> Bug Report
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" placeholder={feedbackType === 'idea' ? "e.g., Add gamification..." : "e.g., Page crashes..."} required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" placeholder="Please provide as much detail as possible." required></textarea>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="text-gray-300 mr-4">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
