import { CheckCircle, XCircle, Clock, Activity, AlertTriangle, Shield, Globe, Code, Database } from 'lucide-react';

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  running: { icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  pending: { icon: Clock, color: 'text-dark-400', bg: 'bg-dark-800/50', border: 'border-white/10' },
  cancelled: { icon: XCircle, color: 'text-dark-500', bg: 'bg-dark-800/50', border: 'border-white/10' },
};

const typeConfig = {
  web: { icon: Globe, label: 'Web Application' },
  api: { icon: Database, label: 'API Endpoint' },
  repo: { icon: Code, label: 'Code Repository' },
};

export default function ScanCard({ scan, onClick }) {
  const status = statusConfig[scan.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const type = typeConfig[scan.targetType] || typeConfig.web;
  const TypeIcon = type.icon;

  const severityCount = (scan.statistics?.criticalCount || 0) + (scan.statistics?.highCount || 0);

  return (
    <div
      onClick={onClick}
      className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:bg-dark-800/70 hover:border-white/10 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${status.bg} ${status.border} border`}>
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{scan.targetUrl || scan.target}</h3>
            <p className="text-xs text-dark-400 mt-1 flex items-center gap-1">
              <TypeIcon className="w-3 h-3" />
              {type.label}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} ${status.border} border`}>
          {scan.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-2 bg-dark-900/50 rounded-lg">
          <p className="text-2xl font-bold text-white">{scan.statistics?.totalFindings || scan.findings?.length || 0}</p>
          <p className="text-xs text-dark-400">Total Findings</p>
        </div>
        <div className="text-center p-2 bg-dark-900/50 rounded-lg">
          <p className="text-2xl font-bold text-red-400">{severityCount}</p>
          <p className="text-xs text-dark-400">Critical/High</p>
        </div>
        <div className="text-center p-2 bg-dark-900/50 rounded-lg">
          <p className="text-2xl font-bold text-white">{scan.duration || 0}s</p>
          <p className="text-xs text-dark-400">Duration</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-dark-400">Progress</span>
          <span className="text-white font-medium">{scan.progress || 0}%</span>
        </div>
        <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              scan.status === 'completed' ? 'bg-green-500' :
              scan.status === 'failed' ? 'bg-red-500' :
              scan.status === 'running' ? 'bg-blue-500' :
              'bg-dark-600'
            }`}
            style={{ width: `${scan.progress || 0}%` }}
          />
        </div>
      </div>

      {severityCount > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {severityCount} {severityCount === 1 ? 'critical/high' : 'critical/high'} finding{severityCount !== 1 ? 's' : ''} detected
          </span>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-dark-400">
        <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
        <span className="font-mono">{scan.scanMode || 'standard'}</span>
      </div>
    </div>
  );
}
