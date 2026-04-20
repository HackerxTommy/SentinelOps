import { useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  GitPullRequest,
  Loader2,
  Search,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

export default function PRReview() {
  const [repoUrl, setRepoUrl] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [filesScanned, setFilesScanned] = useState(0);
  const [error, setError] = useState("");
  const [scanned, setScanned] = useState(false);

  const handleReview = async () => {
    if (!repoUrl || !prNumber) return;
    setReviewing(true);
    setError("");
    setVulnerabilities([]);
    setScanned(false);
    try {
      const { data } = await api.post("/whitebox/pr/review", {
        repoUrl,
        prNumber: parseInt(prNumber),
      });
      setVulnerabilities(data.vulnerabilities || []);
      setFilesScanned(data.filesScanned || 0);
      setScanned(true);
    } catch (err) {
      setError(err.response?.data?.message || "Review failed");
    } finally {
      setReviewing(false);
    }
  };

  const sevColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
    info: "bg-gray-500",
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <GitPullRequest className="w-7 h-7 text-purple-400" />
            PR Security Review
          </h1>
          <p className="text-gray-500 mt-1">
            Scan pull request diffs for SQL injection, XSS, hardcoded secrets,
            command injection, and path traversal
          </p>
        </div>

        {/* Form */}
        <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4 mb-6">
          <h3 className="text-white font-semibold text-sm">Enter PR Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/40 placeholder:text-gray-600"
            />
            <input
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
              placeholder="PR Number (e.g. 42)"
              type="number"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/40 placeholder:text-gray-600"
            />
          </div>
          <button
            onClick={handleReview}
            disabled={reviewing || !repoUrl || !prNumber}
            className="flex items-center gap-2 px-4 py-2.5 btn-primary rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {reviewing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {reviewing ? "Reviewing PR Diff..." : "Review Pull Request"}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {scanned && vulnerabilities.length === 0 && (
          <div className="text-center py-16 border border-dashed border-green-500/20 rounded-2xl bg-green-500/5">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-green-400 font-medium mb-2">
              No Vulnerabilities Found
            </h3>
            <p className="text-gray-500 text-sm">
              {filesScanned} files scanned — PR looks clean!
            </p>
          </div>
        )}

        {vulnerabilities.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                Found {vulnerabilities.length} issues in {filesScanned} files
              </h3>
            </div>
            <div className="space-y-3">
              {vulnerabilities.map((v, i) => (
                <div
                  key={v._id || i}
                  className="p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span
                      className={`px-2 py-0.5 rounded text-xs text-white ${sevColors[v.severity] || "bg-gray-500"}`}
                    >
                      {v.severity}
                    </span>
                    <span className="text-white text-sm font-medium">
                      {v.type}
                    </span>
                    <span className="text-gray-500 text-xs ml-auto font-mono">
                      {v.file}:{v.line}
                    </span>
                  </div>
                  {v.description && (
                    <p className="text-gray-400 text-xs mb-3">
                      {v.description}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-red-400 mb-1 font-medium">
                        Vulnerable Code
                      </p>
                      <pre className="text-xs text-red-300 bg-red-500/5 border border-red-500/10 p-3 rounded overflow-x-auto whitespace-pre-wrap font-mono">
                        {v.code_snippet}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs text-green-400 mb-1 font-medium">
                        Suggested Fix
                      </p>
                      <pre className="text-xs text-green-300 bg-green-500/5 border border-green-500/10 p-3 rounded overflow-x-auto whitespace-pre-wrap font-mono">
                        {v.patched_code}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!reviewing && !scanned && !error && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <GitPullRequest className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">
              Review a Pull Request
            </h3>
            <p className="text-gray-500 text-sm">
              Enter a GitHub repository URL and PR number to scan the diff for
              security vulnerabilities
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
