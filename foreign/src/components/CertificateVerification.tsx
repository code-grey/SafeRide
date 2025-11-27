import React from 'react';
import { FaUpload, FaCheckCircle } from 'react-icons/fa';

const CertificateVerification: React.FC = () => {
  const [isVerified, setIsVerified] = React.useState(false);

  const handleVerification = (event: React.FormEvent) => {
    event.preventDefault();
    // Mock verification logic
    setIsVerified(true);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Insurance Certificate Verification</h3>
      <p className="text-gray-400 mb-6">
        Verify your insurance certificate using its unique blockchain hash or by uploading the document.
      </p>

      {isVerified ? (
        <div className="text-center p-6 bg-green-500/20 border border-green-500 rounded-lg">
          <FaCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white">Certificate Verified Successfully</h4>
          <p className="text-gray-300">Hash: 0x123...abc | Timestamp: 2023-10-27 15:00:00</p>
        </div>
      ) : (
        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label htmlFor="hash" className="block text-sm font-medium text-gray-300 mb-2">Verify with Blockchain Hash</label>
            <input type="text" id="hash" name="hash" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter certificate hash" />
          </div>

          <div className="text-center my-4 text-gray-500">OR</div>

          <div className="mb-6">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">Upload Document</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-500" />
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Verify Certificate
          </button>
        </form>
      )}
    </div>
  );
};

export default CertificateVerification;
