import { useState, useEffect } from "react";
import { domainAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Globe,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");

  useEffect(() => {
    domainAPI
      .list()
      .then((r) => setDomains(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addDomain = async () => {
    if (!newDomain.trim()) return;
    try {
      const { data } = await domainAPI.add({ domain: newDomain.trim() });
      setDomains((prev) => [data, ...prev]);
      setNewDomain("");
    } catch (e) {
      console.error(e);
    }
  };

  const deleteDomain = async (id) => {
    await domainAPI.delete(id);
    setDomains((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Domains</h1>
            <p className="text-gray-500 mt-1">
              Manage domains for attack surface monitoring
            </p>
          </div>
        </div>
        <div className="flex gap-2 mb-6">
          <input
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addDomain()}
            placeholder="example.com"
            className="flex-1 max-w-md bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/40"
          />
          <button
            onClick={addDomain}
            className="flex items-center gap-2 px-4 py-2.5 btn-primary rounded-lg text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Domain
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : domains.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No domains tracked</h3>
            <p className="text-gray-500 text-sm">
              Add a domain to start monitoring your attack surface
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {domains.map((d) => (
              <div
                key={d._id}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {d.domain}
                    </h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {d.subdomains?.length || 0} subdomains • {d.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${d.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}
                  >
                    {d.status}
                  </span>
                  <a
                    href={`https://${d.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteDomain(d._id)}
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
