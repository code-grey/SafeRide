import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedLayout from './ProtectedLayout';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
