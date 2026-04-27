import React from 'react';

export default function RiskBadge({ riskLevel }) {
  let colorClasses = '';
  
  switch (riskLevel) {
    case 'Critical':
      colorClasses = 'bg-red-900/50 text-red-400 border-red-800';
      break;
    case 'High':
      colorClasses = 'bg-orange-900/50 text-orange-400 border-orange-800';
      break;
    case 'Medium':
      colorClasses = 'bg-yellow-900/50 text-yellow-400 border-yellow-800';
      break;
    case 'Low':
    default:
      colorClasses = 'bg-green-900/50 text-green-400 border-green-800';
      break;
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}>
      {riskLevel}
    </span>
  );
}
