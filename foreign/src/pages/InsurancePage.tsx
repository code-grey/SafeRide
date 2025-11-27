import React from 'react';
import CertificateVerification from '../components/CertificateVerification';
import PolicyDetails from '../components/PolicyDetails';

const InsurancePage = () => {
  return (
    <div className="min-h-screen bg-dark-background text-white p-6 md:p-8">
      {/* Header */}
      <div className="mb-12">
        <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Insurance Module</span>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight">Safety Certification</h1>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <CertificateVerification />
        <PolicyDetails />
      </div>
    </div>
  );
};

export default InsurancePage;
