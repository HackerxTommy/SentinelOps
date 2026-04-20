import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { scanAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Shield,
  AlertTriangle,
  Activity,
  Plus,
  GitBranch,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Terminal,
  Search,
  ChevronRight,
  Zap,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [scansRes, analyticsRes] = await Promise.all([
        scanAPI.list().catch(() => ({ data: [] })),
        scanAPI.getAnalytics().catch(() => ({ data: {} })),
      ]);
      setScans(
        Array.isArray(scansRes.data)
          ? scansRes.data
          : scansRes.data.scans || []
      );
      setAnalytics(analyticsRes.data || {});
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScans =
    selectedTab === "all"
      ? scans
      : scans.filter((scan) => scan.targetType === selectedTab);

  const stats = {
    totalScans: analytics?.totalScans || 0,
    totalFindings: analytics?.vulnerabilities?.total || 0,
    criticalIssues: analytics?.vulnerabilities?.critical || 0,
    activeScans: analytics?.activeScans || 0,
  };

  const severityData = analytics?.vulnerabilities || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const statCards = [
    {
      label: "Total Scans",
      value: stats.totalScans,
      icon: Search,
      color: "blue",
      extra: "+12%",
      extraColor: "text-green-400",
    },
    {
      label: "Vulnerabilities",
      value: stats.totalFindings,
      icon: AlertTriangle,
      color: "red",
      extra: "Live",
      extraColor: "text-red-400",
    },
    {
      label: "Critical Issues",
      value: stats.criticalIssues,
      icon: Activity,
      color: "orange",
      extra: `${stats.activeScans} Active`,
      extraColor: "text-orange-400",
    },
    {
      label: "Avg Duration",
      value: "0s",
      icon: Clock,
      color: "green",
      extra: "Avg",
      extraColor: "text-gray-400",
    },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", glow: "from-blue-500/5" },
    red: { bg: "bg-red-500/10", text: "text-red-400", glow: "from-red-500/5" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", glow: "from-orange-500/5" },
    green: { bg: "bg-green-500/10", text: "text-green-400", glow: "from-green-500/5" },
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">

        {/* ═══════════ HERO BANNER ═══════════ */}
        <div className="relative mb-10 p-8 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          {/* Subtle gradient overlay — no lightning */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-transparent pointer-events-none" />

          <div className="relative flex items-start justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-sm font-medium text-blue-400">
                  <Zap className="w-3.5 h-3.5" />
                  AI-Powered Security
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-sm font-medium text-green-400">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  System Active
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                Penetration Testing in Hours,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Not Weeks
                </span>
              </h1>

              <p className="text-gray-500 text-base max-w-xl mb-6 leading-relaxed">
                SentinelOps uses AI agents to find and fix vulnerabilities
                before they reach production. Connect your repos and domains, and
                launch a pentest in minutes.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/pentests")}
                  className="group flex items-center gap-2 px-5 py-2.5 btn-primary rounded-xl font-semibold text-white text-sm"
                >
                  <Play className="w-4 h-4" />
                  Start New Pentest
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/repositories")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-medium text-gray-300 text-sm transition-all border border-white/5"
                >
                  <GitBranch className="w-4 h-4" />
                  Connect GitHub
                </button>
              </div>
            </div>

            {/* Decorative Shield */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                <div className="relative w-full h-full rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                  <Shield className="w-20 h-20 text-blue-500/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ STATS GRID ═══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((s) => {
            const c = colorMap[s.color];
            return (
              <div
                key={s.label}
                className="group relative bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center`}>
                      <s.icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <span className={`text-xs font-medium ${s.extraColor}`}>
                      {s.extra}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════ SEVERITY + ACTIVITY ROW ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          {/* Severity Chart */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Findings by Severity
            </h3>
            <div className="space-y-3.5">
              {[
                { label: "Critical", value: severityData.critical, color: "bg-red-500", textColor: "text-red-400" },
                { label: "High", value: severityData.high, color: "bg-orange-500", textColor: "text-orange-400" },
                { label: "Medium", value: severityData.medium, color: "bg-yellow-500", textColor: "text-yellow-400" },
                { label: "Low", value: severityData.low, color: "bg-green-500", textColor: "text-green-400" },
                { label: "Info", value: severityData.info, color: "bg-blue-500", textColor: "text-blue-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-16 text-sm text-gray-500">{item.label}</div>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.max((item.value / (stats.totalFindings || 1)) * 100, 4)}%`,
                      }}
                    />
                  </div>
                  <div className={`w-7 text-sm font-medium text-right ${item.textColor}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Recent Activity
              </h3>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            </div>
            <div className="space-y-2">
              {analytics?.scans?.slice(0, 5).map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center gap-3 p-3.5 bg-white/[0.02] rounded-lg border border-white/5 hover:bg-white/[0.04] transition-all"
                >
                  {getStatusIcon(scan.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm truncate">
                        {scan.target}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs bg-white/5 rounded text-gray-500 capitalize">
                        {scan.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {new Date(scan.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${scan.findings > 0 ? "text-red-400" : "text-green-400"}`}>
                      {scan.findings} issues
                    </div>
                    <div className="text-xs text-gray-600 capitalize">{scan.status}</div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-600">
                  <Terminal className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════ SCANS TABLE ═══════════ */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Security Scans</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Monitor and manage your active security tests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white/[0.03] rounded-lg p-1">
                {["all", "web", "api", "repo"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      selectedTab === tab
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate("/pentests")}
                className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg font-medium text-white text-sm"
              >
                <Plus className="w-4 h-4" />
                New Scan
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="text-center py-14">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No scans yet</h3>
              <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
                Launch your first AI-powered security scan
              </p>
              <button
                onClick={() => navigate("/pentests")}
                className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary rounded-xl font-medium text-white text-sm"
              >
                <Play className="w-4 h-4" />
                Start First Pentest
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredScans.map((scan) => (
                <div
                  key={scan._id}
                  className="flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  onClick={() => navigate("/pentests")}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(scan.status)}
                    <div>
                      <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                        {scan.name || scan.target}
                      </span>
                      <p className="text-gray-600 text-xs mt-0.5">
                        {scan.targets?.map((t) => t.value).join(", ") ||
                          scan.target ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs capitalize px-2 py-0.5 bg-white/5 rounded">
                      {scan.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
