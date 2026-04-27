import { TrendingUp, Shield, AlertTriangle, Activity } from 'lucide-react';

const statsConfig = {
  scans: { icon: Shield, color: 'text-accent-blue', bg: 'bg-blue-900/20', border: 'border-blue-800' },
  findings: { icon: AlertTriangle, color: 'text-accent-red', bg: 'bg-red-900/20', border: 'border-red-800' },
  active: { icon: Activity, color: 'text-accent-green', bg: 'bg-green-900/20', border: 'border-green-800' },
  coverage: { icon: TrendingUp, color: 'text-accent-blue', bg: 'bg-blue-900/20', border: 'border-blue-800' },
};

export default function StatsCard({ type, value, label, trend }) {
  const config = statsConfig[type];
  const Icon = config.icon;

  return (
    <div className="card hover:border-dark-500 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${config.bg} ${config.border} border`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
