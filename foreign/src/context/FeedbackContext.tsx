import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FeedbackContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <FeedbackContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </FeedbackContext.Provider>
  );
};
