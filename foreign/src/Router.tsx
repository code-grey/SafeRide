import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LiveChatWidget from './components/LiveChatWidget';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import InsurancePage from './pages/InsurancePage';
import BlockchainRecordsPage from './pages/BlockchainRecordsPage';
import SettingsPage from './pages/SettingsPage';
import RewardsPage from './pages/RewardsPage';
import DevicesPage from './pages/DevicesPage';
import InsuranceLoginPage from './pages/insurance/InsuranceLoginPage';
import InsuranceRegisterPage from './pages/insurance/InsuranceRegisterPage';
import InsuranceDashboardPage from './pages/insurance/InsuranceDashboardPage';
import DriverRecordsPage from './pages/insurance/DriverRecordsPage';
import ClaimsManagementPage from './pages/insurance/ClaimsManagementPage';
import InsuranceProtectedLayout from './components/InsuranceProtectedLayout';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Driver Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/blockchain" element={<BlockchainRecordsPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Insurance Portal Routes */}
        <Route path="/insurance-portal/login" element={<InsuranceLoginPage />} />
        <Route path="/insurance-portal/register" element={<InsuranceRegisterPage />} />

        {/* Insurance Protected Routes */}
        <Route element={<InsuranceProtectedLayout />}>
          <Route path="/insurance-portal/dashboard" element={<InsuranceDashboardPage />} />
          <Route path="/insurance-portal/drivers" element={<DriverRecordsPage />} />
          <Route path="/insurance-portal/claims" element={<ClaimsManagementPage />} />
          <Route path="/insurance-portal/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <LiveChatWidget />
    </BrowserRouter>
  );
};

export default AppRouter;
