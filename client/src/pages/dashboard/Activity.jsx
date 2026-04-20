import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { scanAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Globe,
  GitBranch,
  Server,
  Loader2,
} from "lucide-react";

export default function Activity() {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
    const interval = setInterval(loadActivity, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadActivity = async () => {
    try {
      const { data } = await scanAPI.list({ limit: 100 });
      setScans(data.scans || []);
    } catch (error) {
      console.error("Failed to load activity:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getTargetIcon = (targetType) => {
    switch (targetType) {
      case "web":
        return <Globe className="w-4 h-4 text-blue-400" />;
      case "api":
        return <Server className="w-4 h-4 text-blue-400" />;
      case "repo":
        return <GitBranch className="w-4 h-4 text-orange-400" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Audit Reports</h1>
          <p className="text-gray-500">
            Track all your security scan activities and audits
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ActivityIcon className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No audit records yet
            </h3>
            <p className="text-gray-500">
              Your scan activities and audits will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan._id}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    {getStatusIcon(scan.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {scan.target || scan.name || "Unknown Target"}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          scan.status === "running"
                            ? "bg-blue-500/10 text-blue-400"
                            : scan.status === "completed"
                              ? "bg-green-500/10 text-green-400"
                              : scan.status === "failed"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {scan.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-2">
                        {getTargetIcon(scan.targetType)}
                        <span className="capitalize">
                          {scan.targetType || "web"}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(scan.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {scan.status === "completed" && scan.findings && (
                      <div className="text-sm">
                        <span className="text-gray-400">
                          Found {scan.findings.length} vulnerabilities
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
