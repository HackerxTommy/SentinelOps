import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { attackSurfaceAPI } from '../services/api';
import { Globe, Server, Radio, FolderOpen, Code, ExternalLink, RefreshCw, Shield, Wifi, FileCode } from 'lucide-react';

export default function ASM() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subdomains');

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result } = await attackSurfaceAPI.list();
      setData(result);
    } catch (err) {
      console.error('ASM fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const tabs = [
    { id: 'subdomains', label: 'Subdomains', icon: Globe, count: data?.summary?.totalSubdomains || 0 },
    { id: 'liveHosts', label: 'Live Hosts', icon: Server, count: data?.summary?.totalLiveHosts || 0 },
    { id: 'openPorts', label: 'Open Ports', icon: Radio, count: data?.summary?.totalOpenPorts || 0 },
    { id: 'endpoints', label: 'Endpoints', icon: ExternalLink, count: data?.summary?.totalEndpoints || 0 },
    { id: 'directories', label: 'Directories', icon: FolderOpen, count: data?.summary?.totalDirectories || 0 },
    { id: 'jsFiles', label: 'JS Files', icon: FileCode, count: data?.summary?.totalJsFiles || 0 },
  ];

  const renderContent = () => {
    if (!data) return <p className="text-gray-500 text-center py-16">No attack surface data yet. Run a pentest scan first.</p>;
    
    const items = data[activeTab] || [];
    if (items.length === 0) return <p className="text-gray-500 text-center py-16">No {activeTab} discovered yet.</p>;

    switch (activeTab) {
      case 'subdomains':
        return (
          <div className="space-y-2">
            {items.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-mono text-sm">{s.domain}</span>
                </div>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">{s.source}</span>
              </motion.div>
            ))}
          </div>
        );
      case 'liveHosts':
        return (
          <div className="space-y-2">
            {items.map((h, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-green-400" />
                  <div>
                    <span className="text-white font-mono text-sm">{h.url}</span>
                    {h.title && <span className="text-gray-500 text-xs ml-3">— {h.title}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(h.tech || []).slice(0, 3).map((t, j) => (
                    <span key={j} className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{t}</span>
                  ))}
                  <span className={`text-xs px-2 py-1 rounded font-mono ${h.statusCode < 300 ? 'text-green-400 bg-green-500/10' : h.statusCode < 400 ? 'text-yellow-400 bg-yellow-500/10' : 'text-red-400 bg-red-500/10'}`}>
                    {h.statusCode}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 'openPorts':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-mono font-bold">{p.host}:{p.port}</span>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">{p.state}</span>
                </div>
                {p.service && <p className="text-gray-400 text-sm">{p.service}</p>}
              </motion.div>
            ))}
          </div>
        );
      case 'endpoints':
        return (
          <div className="space-y-2">
            {items.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${e.method === 'POST' ? 'text-orange-400 bg-orange-500/10' : 'text-green-400 bg-green-500/10'}`}>
                  {e.method || 'GET'}
                </span>
                <span className="text-white font-mono text-sm truncate">{e.url}</span>
              </div>
            ))}
          </div>
        );
      case 'directories':
        return (
          <div className="space-y-2">
            {items.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-mono text-sm">{d.url}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-mono ${d.status < 300 ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        );
      case 'jsFiles':
        return (
          <div className="space-y-2">
            {items.map((js, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <Code className="w-4 h-4 text-purple-400" />
                <span className="text-white font-mono text-sm truncate">{js.url || js}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-400" />
              Attack Surface Management
            </h1>
            <p className="text-gray-500 mt-1">Real-time discovery of your external attack surface from scan results</p>
          </div>
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-white text-sm disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        {data?.summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tabs.map(tab => (
              <motion.div key={tab.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${activeTab === tab.id ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}>
                <tab.icon className={`w-5 h-5 mb-2 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-500'}`} />
                <p className="text-2xl font-bold text-white">{tab.count}</p>
                <p className="text-xs text-gray-500">{tab.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">{tab.count}</span>
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
