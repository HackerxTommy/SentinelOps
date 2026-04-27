import React, { useState } from 'react';
import axios from 'axios';

export default function ScanButton({ targetDomain, onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!targetDomain) {
      setError('Please enter a target domain');
      return;
    }
    
    setIsScanning(true);
    setError('');
    
    try {
      await axios.post('/api/asm/scan', { targetDomain }, { withCredentials: true });
      if (onScanComplete) {
        onScanComplete();
      }
    } catch (err) {
      console.error('Scan failed:', err);
      setError(err.response?.data?.error || 'Scan failed to complete');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button 
        onClick={handleScan}
        disabled={isScanning || !targetDomain}
        className={`px-6 py-2 rounded-md font-medium text-sm transition-all shadow-md
          ${isScanning 
            ? 'bg-blue-800 text-blue-200 cursor-not-allowed' 
            : !targetDomain
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'btn-primary text-white'}`}
      >
        {isScanning ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Scanning...
          </span>
        ) : 'Start Scan'}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
