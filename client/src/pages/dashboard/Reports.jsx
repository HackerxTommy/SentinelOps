import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { reportAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data } = await reportAPI.list();
      setReports(data.reports || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId, format) => {
    try {
      const { data } = await reportAPI.get(reportId);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Security Reports
          </h1>
          <p className="text-dark-400">
            View and download your security scan reports
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No reports yet
            </h3>
            <p className="text-gray-500">
              Reports will appear here after you complete security pentests
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {report.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Vulnerabilities: {report.findingsCount || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Calendar className="w-4 h-4" />
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDownload(report._id, "json")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 btn-primary rounded-lg text-sm font-medium text-white transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDownload(report._id, "json")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-gray-300 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
