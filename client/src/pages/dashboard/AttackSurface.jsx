import { useState, useEffect } from "react";
import { attackSurfaceAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Radar,
  Globe,
  Server,
  Database,
  AlertTriangle,
  Shield,
  Activity,
  RefreshCw,
  Loader2,
  ExternalLink,
  Network,
  Code,
  Folder,
} from "lucide-react";

export default function AttackSurface() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("subdomains");

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const { data: resp } = await attackSurfaceAPI.list();
      setData(resp);
    } catch (error) {
      console.error("Error loading assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const summary = data?.summary || {};

  const statCards = [
    { label: "Subdomains", value: summary.totalSubdomains || 0, icon: Globe, color: "blue" },
    { label: "Live Hosts", value: summary.totalLiveHosts || 0, icon: Server, color: "green" },
    { label: "Open Ports", value: summary.totalOpenPorts || 0, icon: Network, color: "orange" },
    { label: "Endpoints", value: summary.totalEndpoints || 0, icon: Database, color: "purple" },
    { label: "Directories", value: summary.totalDirectories || 0, icon: Folder, color: "yellow" },
    { label: "JS Files", value: summary.totalJsFiles || 0, icon: Code, color: "cyan" },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-500/20", text: "text-blue-400", glow: "from-blue-500/10" },
    green: { bg: "bg-green-500/20", text: "text-green-400", glow: "from-green-500/10" },
    orange: { bg: "bg-orange-500/20", text: "text-orange-400", glow: "from-orange-500/10" },
    purple: { bg: "bg-purple-500/20", text: "text-purple-400", glow: "from-purple-500/10" },
    yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400", glow: "from-yellow-500/10" },
    cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", glow: "from-cyan-500/10" },
  };

  const tabs = [
    { key: "subdomains", label: "Subdomains", count: data?.subdomains?.length || 0 },
    { key: "liveHosts", label: "Live Hosts", count: data?.liveHosts?.length || 0 },
    { key: "openPorts", label: "Open Ports", count: data?.openPorts?.length || 0 },
    { key: "endpoints", label: "Endpoints", count: data?.endpoints?.length || 0 },
    { key: "directories", label: "Directories", count: data?.directories?.length || 0 },
    { key: "jsFiles", label: "JS Files", count: data?.jsFiles?.length || 0 },
  ];

  const renderTabContent = () => {
    if (!data) return null;

    switch (activeTab) {
      case "subdomains":
        return (data.subdomains || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">{item.domain}</p>
                <p className="text-xs text-gray-500">Source: {item.source}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{new Date(item.discoveredAt).toLocaleDateString()}</span>
          </div>
        ));

      case "liveHosts":
        return (data.liveHosts || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">{item.url}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${item.statusCode >= 200 && item.statusCode < 400 ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                    {item.statusCode}
                  </span>
                  {item.title && <span className="text-xs text-gray-500">{item.title}</span>}
                </div>
              </div>
            </div>
            {item.tech?.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {item.tech.slice(0, 3).map((t, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">{t}</span>
                ))}
              </div>
            )}
          </div>
        ));

      case "openPorts":
        return (data.openPorts || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3">
              <Network className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-white">{item.host}:{item.port}</p>
                <p className="text-xs text-gray-500">Service: {item.service || "unknown"}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${item.state === "open" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
              {item.state}
            </span>
          </div>
        ));

      case "endpoints":
        return (data.endpoints || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white truncate max-w-md">{item.url}</p>
                <p className="text-xs text-gray-500">{item.method} • {item.source}</p>
              </div>
            </div>
          </div>
        ));

      case "directories":
        return (data.directories || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3">
              <Folder className="w-4 h-4 text-yellow-400" />
              <p className="text-sm font-medium text-white truncate max-w-md">{item.url}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${item.status >= 200 && item.status < 400 ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
              {item.status}
            </span>
          </div>
        ));

      case "jsFiles":
        return (data.jsFiles || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3">
              <Code className="w-4 h-4 text-cyan-400" />
              <p className="text-sm font-medium text-white truncate max-w-md">{item.url}</p>
            </div>
            <a href={item.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Attack Surface Monitoring
            </h1>
            <p className="text-gray-500">
              Monitor and manage your organization's attack surface from completed scans
            </p>
          </div>
          <button
            onClick={() => { setLoading(true); loadAssets(); }}
            className="flex items-center gap-2 px-5 py-2.5 btn-primary rounded-xl font-medium text-white text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : !data || Object.values(summary).every(v => v === 0 || v === null) ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Radar className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No attack surface data yet
            </h3>
            <p className="text-gray-500">
              Complete security scans to populate your attack surface data
            </p>
          </div>
        ) : (
          <>
            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {statCards.map((stat) => {
                const c = colorMap[stat.color];
                return (
                  <div
                    key={stat.label}
                    onClick={() => setActiveTab(tabs.find(t => t.label === stat.label)?.key || activeTab)}
                    className="group relative bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative">
                      <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center mb-3`}>
                        <stat.icon className={`w-5 h-5 ${c.text}`} />
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Last Scan Info ── */}
            {summary.lastScanDate && (
              <div className="flex items-center gap-3 mb-6 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm text-gray-400">
                  Last scan: {new Date(summary.lastScanDate).toLocaleString()}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-400">
                  {summary.monitoredDomains} monitored domain{summary.monitoredDomains !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* ── Tab Navigation ── */}
            <div className="flex gap-1 mb-6 bg-white/[0.02] rounded-lg p-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-1.5 text-xs ${activeTab === tab.key ? "text-blue-200" : "text-gray-600"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Tab Content ── */}
            <div className="space-y-2">
              {renderTabContent()?.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-500">No data for this category yet</p>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
