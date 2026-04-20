import { useState, useEffect } from "react";
import { reportAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  FileText,
  Download,
  Search,
  Calendar,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function AuditReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data } = await reportAPI.list();
      setReports(data.reports || []);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "in_progress":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400";
      case "in_progress":
        return "bg-yellow-500/10 text-yellow-400";
      case "failed":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const filteredReports = reports.filter((report) => {
    const title = report.title || report.name || "Untitled Report";
    const compliance = report.compliance || [];
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      compliance.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      filter === "all" || filter === report.status || filter === report.type;
    return matchesSearch && matchesFilter;
  });

  const statCards = [
    {
      label: "Total Reports",
      value: reports.length,
      icon: FileText,
      color: "blue",
    },
    {
      label: "Completed",
      value: reports.filter((r) => r.status === "completed").length,
      icon: CheckCircle2,
      color: "green",
    },
    {
      label: "In Progress",
      value: reports.filter((r) => r.status === "in_progress").length,
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      label: "Compliance Standards",
      value: [...new Set(reports.flatMap((r) => r.compliance || []))].length,
      icon: Shield,
      color: "purple",
    },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-500/20", text: "text-blue-400", glow: "from-blue-500/10" },
    green: { bg: "bg-green-500/20", text: "text-green-400", glow: "from-green-500/10" },
    yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400", glow: "from-yellow-500/10" },
    purple: { bg: "bg-purple-500/20", text: "text-purple-400", glow: "from-purple-500/10" },
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Audit & Compliance Reports
            </h1>
            <p className="text-gray-500">
              Security audits and compliance documentation
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 btn-primary rounded-xl font-medium text-white text-sm">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const c = colorMap[stat.color];
            return (
              <div
                key={stat.label}
                className="group relative bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-center gap-3">
                  <div className={`p-2 ${c.bg} rounded-lg`}>
                    <stat.icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/40 w-full"
            />
          </div>
          <div className="flex bg-white/[0.02] rounded-lg p-1">
            {["all", "audit", "compliance"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === type
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Reports ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No audit reports yet
            </h3>
            <p className="text-gray-500">
              Generate compliance reports from your security scans
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report._id || report.id}
                className="group bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {report.title || report.name || "Untitled Report"}
                        </h3>
                        <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400 capitalize">
                          {report.type}
                        </span>
                        {getStatusIcon(report.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        {(report.compliance || []).map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm mb-4 flex-wrap">
                  <span className="text-gray-400">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                  {report.author && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">By {report.author}</span>
                    </>
                  )}
                  {report.vulnerabilities && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-red-400">{report.vulnerabilities.critical} Critical</span>
                      <span className="text-orange-400">{report.vulnerabilities.high} High</span>
                      <span className="text-yellow-400">{report.vulnerabilities.medium} Medium</span>
                      <span className="text-blue-400">{report.vulnerabilities.low} Low</span>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/api/reports/${report._id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-sm text-white"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
