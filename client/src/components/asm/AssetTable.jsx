import React from 'react';
import RiskBadge from './RiskBadge';

export default function AssetTable({ assets, onViewDetails }) {
  if (!assets || assets.length === 0) {
    return <div className="p-8 text-center text-gray-500">No assets found. Run a scan to discover assets.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-900 border-b border-gray-700">
            <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Hostname</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Ports</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Risk</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Last Seen</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {assets.map((asset) => (
            <tr key={asset._id} className="hover:bg-gray-750 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-white">{asset.hostname}</div>
                <div className="text-xs text-gray-500">{asset.ip || 'Unknown IP'}</div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 capitalize">{asset.assetType}</span>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-300">{asset.ports?.length || 0} Open</div>
              </td>
              <td className="py-3 px-4">
                <RiskBadge riskLevel={asset.riskLevel} />
              </td>
              <td className="py-3 px-4 text-sm text-gray-400">
                {new Date(asset.lastSeen).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <button 
                  onClick={() => onViewDetails(asset)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
