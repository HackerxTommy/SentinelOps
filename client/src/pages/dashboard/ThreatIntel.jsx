import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import {
  Shield,
  AlertTriangle,
  Activity,
  Eye,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import { threatIntelAPI } from "../../services/api";

export default function ThreatIntel() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [threats, setThreats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadThreats();
  }, []);

  const loadThreats = async () => {
    try {
      const { data } = await threatIntelAPI.list();
      setThreats(data.threats || []);
    } catch (error) {
      console.error("Error loading threats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      filter === threat.severity ||
      filter === threat.status;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"}`}
      >
        <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Threat Intelligence
            </h1>
            <p className="text-dark-400">
              Real-time threat intelligence and vulnerability monitoring
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {threats.filter((t) => t.severity === "critical").length}
                  </p>
                  <p className="text-xs text-dark-400">Critical</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {threats.filter((t) => t.severity === "high").length}
                  </p>
                  <p className="text-xs text-dark-400">High</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {threats.filter((t) => t.status === "active").length}
                  </p>
                  <p className="text-xs text-dark-400">Active</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {threats.length}
                  </p>
                  <p className="text-xs text-dark-400">Total Threats</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search threats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500 w-full"
              />
            </div>
            <div className="flex bg-dark-800/50 rounded-lg p-1">
              {["all", "critical", "high", "active"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === status
                      ? "bg-brand-600 text-white"
                      : "text-dark-300 hover:text-white"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Threats List */}
          <div className="space-y-4">
            {filteredThreats.map((threat) => (
              <div
                key={threat.id}
                className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:bg-dark-800/70 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-dark-700/50 rounded-lg">
                      <Shield className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {threat.identifier}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(threat.severity)}`}
                        >
                          {threat.severity}
                        </span>
                        <span className="px-2 py-1 bg-dark-700 rounded text-xs text-dark-300 capitalize">
                          {threat.type}
                        </span>
                      </div>
                      <p className="text-sm text-dark-300">
                        {threat.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      threat.status === "active"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {threat.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm mb-4">
                  <span className="text-dark-300">
                    Affected: {threat.affectedAssets.join(", ")}
                  </span>
                  <span className="text-dark-400">•</span>
                  <span className="text-dark-300 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(threat.publishedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm text-white transition-all">
                    Investigate
                  </button>
                  <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-white transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
