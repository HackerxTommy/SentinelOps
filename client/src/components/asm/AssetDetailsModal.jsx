import React from 'react';
import RiskBadge from './RiskBadge';

export default function AssetDetailsModal({ asset, onClose }) {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">{asset.hostname}</h2>
            <p className="text-sm text-gray-400 mt-1">{asset.ip || 'No IP registered'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Asset Type</div>
              <div className="mt-1 text-white capitalize">{asset.assetType}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Risk Level</div>
              <div className="mt-1"><RiskBadge riskLevel={asset.riskLevel} /></div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Discovered</div>
              <div className="mt-1 text-white">{new Date(asset.discoveredAt).toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Risk Score</div>
              <div className="mt-1 text-white">{asset.riskScore}/100</div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Open Ports & Services</h3>
          {asset.ports && asset.ports.length > 0 ? (
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-400">Port</th>
                    <th className="px-4 py-2 font-medium text-gray-400">Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {asset.ports.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-750">
                      <td className="px-4 py-2 text-blue-400 font-mono">{p.port}</td>
                      <td className="px-4 py-2 text-gray-300">{p.service}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 italic bg-gray-800 p-4 rounded-lg">No open ports detected.</div>
          )}
        </div>

        <div className="p-4 bg-gray-800 border-t border-gray-700 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors">
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
