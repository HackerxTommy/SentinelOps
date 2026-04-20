import { useState, useEffect } from "react";
import { issueAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
} from "lucide-react";

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", severity: "" });
  const [stats, setStats] = useState({
    open: 0,
    resolved: 0,
    critical: 0,
    high: 0,
  });

  useEffect(() => {
    Promise.all([
      issueAPI
        .list(filter)
        .then((r) => setIssues(Array.isArray(r.data) ? r.data : [])),
      issueAPI
        .getStats()
        .then((r) => {
          const d = r.data;
          setStats({
            open: d.byStatus?.open || 0,
            resolved: d.byStatus?.resolved || 0,
            critical: d.bySeverity?.critical || 0,
            high: d.bySeverity?.high || 0,
          });
        })
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [filter]);

  const updateStatus = async (id, status) => {
    await issueAPI.update(id, { status });
    setIssues((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
  };

  const sevColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
    info: "bg-gray-500",
  };
  const statCards = [
    {
      label: "Open Issues",
      value: stats.open,
      color: "text-yellow-400",
      icon: Clock,
    },
    {
      label: "Critical",
      value: stats.critical,
      color: "text-red-400",
      icon: AlertTriangle,
    },
    {
      label: "High",
      value: stats.high,
      color: "text-orange-400",
      icon: AlertTriangle,
    },
    {
      label: "Resolved",
      value: stats.resolved,
      color: "text-green-400",
      icon: CheckCircle,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Issues</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="p-4 bg-white/[0.03] border border-white/5 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-gray-500 text-sm">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          {["", "open", "resolved", "false-positive"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter((f) => ({ ...f, status: s }))}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize ${filter.status === s ? "bg-blue-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              {s || "All"}
            </button>
          ))}
          <div className="flex-1" />
          {["", "critical", "high", "medium", "low"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter((f) => ({ ...f, severity: s }))}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize ${filter.severity === s ? "bg-blue-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              {s || "All Severities"}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <AlertTriangle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">
              No issues found. Run a pentest to discover vulnerabilities.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs text-white ${sevColors[issue.severity]}`}
                  >
                    {issue.severity}
                  </span>
                  <div>
                    <h4 className="text-white text-sm font-medium">
                      {issue.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {issue.location || "Unknown location"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={issue.status}
                    onChange={(e) => updateStatus(issue._id, e.target.value)}
                    className="bg-dark-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 outline-none appearance-none cursor-pointer"
                    style={{ backgroundColor: "#111", color: "#ccc" }}
                  >
                    <option
                      value="open"
                      style={{ backgroundColor: "#111", color: "#ccc" }}
                    >
                      Open
                    </option>
                    <option
                      value="in-progress"
                      style={{ backgroundColor: "#111", color: "#ccc" }}
                    >
                      In Progress
                    </option>
                    <option
                      value="resolved"
                      style={{ backgroundColor: "#111", color: "#22c55e" }}
                    >
                      Resolved
                    </option>
                    <option
                      value="false-positive"
                      style={{ backgroundColor: "#111", color: "#f59e0b" }}
                    >
                      False Positive
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
