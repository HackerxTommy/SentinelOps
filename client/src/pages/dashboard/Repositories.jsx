import { useState, useEffect } from "react";
import { repoAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  GitBranch,
  Plus,
  Trash2,
  Loader2,
  Github,
  ExternalLink,
} from "lucide-react";

export default function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    provider: "github",
    branch: "main",
    language: "",
  });

  useEffect(() => {
    repoAPI
      .list()
      .then((r) => setRepos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addRepo = async () => {
    if (!form.url) return;
    try {
      const name = form.name || form.url.split("/").pop() || "repo";
      const { data } = await repoAPI.add({ ...form, name });
      setRepos((prev) => [data, ...prev]);
      setShowAdd(false);
      setForm({
        name: "",
        url: "",
        provider: "github",
        branch: "main",
        language: "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRepo = async (id) => {
    await repoAPI.delete(id);
    setRepos((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Repositories</h1>
            <p className="text-gray-500 mt-1">
              Connect repositories for code review and deeper analysis
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 btn-primary rounded-lg text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Repository
          </button>
        </div>
        {showAdd && (
          <div className="mb-6 p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
            <h3 className="text-white font-semibold">Add Repository</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                placeholder="https://github.com/user/repo"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none col-span-2 focus:border-blue-500/40"
              />
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Repository name (auto-detected)"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/40"
              />
              <input
                value={form.branch}
                onChange={(e) =>
                  setForm((f) => ({ ...f, branch: e.target.value }))
                }
                placeholder="Branch (default: main)"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/40"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addRepo}
                className="px-4 py-2 btn-primary rounded-lg text-white text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <GitBranch className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">
              No repositories connected
            </h3>
            <p className="text-gray-500 text-sm">
              Add a repository to enable code review and dependency auditing
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {repos.map((repo) => (
              <div
                key={repo._id}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Github className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {repo.name}
                    </h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {repo.url} • {repo.branch}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${repo.status === "connected" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}
                  >
                    {repo.status}
                  </span>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteRepo(repo._id)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
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
