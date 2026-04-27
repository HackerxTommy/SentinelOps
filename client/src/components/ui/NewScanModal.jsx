import { useState } from 'react';
import { X, Globe, Database, Code, Zap, Shield, Search, GitPullRequest } from 'lucide-react';

const scanTypes = [
  { id: 'web', icon: Globe, label: 'Web Application', desc: 'Scan web applications for vulnerabilities' },
  { id: 'api', icon: Database, label: 'API Endpoint', desc: 'Test API endpoints for security issues' },
  { id: 'repo', icon: Code, label: 'Code Repository', desc: 'Analyze code for security flaws' },
  { id: 'pr', icon: GitPullRequest, label: 'PR Security Review', desc: 'Review pull requests for security issues' },
];

const scanModes = [
  { id: 'quick', icon: Zap, label: 'Quick Scan', desc: 'Fast scan for common vulnerabilities', time: '2-5 min' },
  { id: 'standard', icon: Shield, label: 'Standard Scan', desc: 'Comprehensive security assessment', time: '10-15 min' },
  { id: 'deep', icon: Search, label: 'Deep Scan', desc: 'Thorough analysis with advanced checks', time: '30-45 min' },
  { id: 'whitebox', icon: Code, label: 'Whitebox Testing', desc: 'Source code analysis with credentials', time: '20-30 min' },
  { id: 'blackbox', icon: Shield, label: 'Blackbox Testing', desc: 'External penetration testing', time: '15-25 min' },
];

export default function NewScanModal({ isOpen, onClose, onScanCreate }) {
  const [selectedType, setSelectedType] = useState('web');
  const [selectedMode, setSelectedMode] = useState('standard');
  const [targetUrl, setTargetUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onScanCreate({ 
      targetUrl, 
      targetType: selectedType, 
      scanMode: selectedMode
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-dark-900 rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-900 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">New Security Scan</h2>
              <p className="text-sm text-dark-400 mt-1">Configure and launch a penetration test</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5 text-dark-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Target URL
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Scan Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {scanTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200
                      ${isSelected 
                        ? 'border-brand-500 bg-brand-500/10' 
                        : 'border-white/10 hover:border-white/20 bg-dark-800/50'
                      }
                    `}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-brand-400' : 'text-dark-400'}`} />
                    <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-dark-200'}`}>
                      {type.label}
                    </p>
                    <p className="text-xs text-dark-500 mt-1">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Scan Mode
            </label>
            <div className="space-y-2">
              {scanModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`
                      w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-4
                      ${isSelected 
                        ? 'border-brand-500 bg-brand-500/10' 
                        : 'border-white/10 hover:border-white/20 bg-dark-800/50'
                      }
                    `}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-brand-400' : 'text-dark-400'}`} />
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-dark-200'}`}>
                        {mode.label}
                      </p>
                      <p className="text-xs text-dark-500">{mode.desc}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${isSelected ? 'bg-brand-500 text-white' : 'bg-dark-700 text-dark-400'}`}>
                      {mode.time}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 rounded-lg font-medium text-dark-200 transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium text-white transition-all"
            >
              <Shield className="w-5 h-5 mr-2 inline" />
              Start Scan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
