import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './Router';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';
import FeedbackModal from './components/FeedbackModal';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const AppContent = () => {
  const { isModalOpen, closeModal } = useFeedback();
  return (
    <>
      <AppRouter />
      <FeedbackModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <FeedbackProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </FeedbackProvider>
    </AuthProvider>
  </React.StrictMode>
);
