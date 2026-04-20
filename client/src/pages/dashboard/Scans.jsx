import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { scanAPI } from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import NewScanModal from "../../components/ui/NewScanModal";
import {
  Plus,
  Shield,
  Activity as ActivityIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";

export default function Scans() {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNewScanModal, setShowNewScanModal] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadScans();
    const interval = setInterval(loadScans, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadScans = async () => {
    try {
      const { data } = await scanAPI.list({ limit: 50 });
      setScans(data.scans || []);
    } catch (error) {
      console.error("Failed to load scans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanCreate = async (scanData) => {
    try {
      await scanAPI.create(scanData);
      loadScans();
    } catch (error) {
      console.error("Failed to create scan:", error);
    }
  };

  const filteredScans =
    filter === "all" ? scans : scans.filter((scan) => scan.status === filter);

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return <ActivityIcon className="w-4 h-4 text-blue-400 animate-pulse" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Security Scans
              </h1>
              <p className="text-dark-400">
                Manage and monitor your security scans
              </p>
            </div>
            <button
              onClick={() => setShowNewScanModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-medium text-white transition-all"
            >
              <Plus className="w-5 h-5" />
              New Scan
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex bg-dark-800/50 rounded-lg p-1">
              {["all", "running", "completed", "failed"].map((status) => (
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

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-dark-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-dark-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No scans found
              </h3>
              <p className="text-dark-400 mb-6">
                Create your first security scan to get started
              </p>
              <button
                onClick={() => setShowNewScanModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-medium text-white transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Scan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredScans.map((scan) => (
                <div
                  key={scan._id}
                  className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:bg-dark-800/70 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-dark-700/50 rounded-lg">
                      {getStatusIcon(scan.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {scan.targetUrl}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            scan.status === "running"
                              ? "bg-blue-500/20 text-blue-400"
                              : scan.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : scan.status === "failed"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {scan.status}
                        </span>
                      </div>
                      <p className="text-dark-400 text-sm mb-3">
                        {scan.targetType} •{" "}
                        {new Date(scan.createdAt).toLocaleString()}
                      </p>
                      {scan.status === "completed" && (
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-dark-300">
                            {scan.statistics?.totalFindings || 0} findings
                          </span>
                          <span className="text-dark-500">•</span>
                          <span className="text-dark-300">
                            {scan.duration}s duration
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <NewScanModal
        isOpen={showNewScanModal}
        onClose={() => setShowNewScanModal(false)}
        onScanCreate={handleScanCreate}
      />
    </div>
  );
}
