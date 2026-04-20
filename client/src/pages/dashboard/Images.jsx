import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import {
  Image,
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { imageAPI } from "../../services/api";

export default function Images() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data } = await imageAPI.list();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter((img) => {
    const matchesSearch = img.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "vulnerable" && img.status === "vulnerable") ||
      (filter === "secure" && img.status === "secure");
    return matchesSearch && matchesFilter;
  });

  const totalVulns = filteredImages.reduce(
    (acc, img) => {
      acc.critical += img.vulnerabilities.critical;
      acc.high += img.vulnerabilities.high;
      acc.medium += img.vulnerabilities.medium;
      acc.low += img.vulnerabilities.low;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  );

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
              Container Images
            </h1>
            <p className="text-dark-400">
              Monitor and scan container images for vulnerabilities
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
                    {totalVulns.critical}
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
                    {totalVulns.high}
                  </p>
                  <p className="text-xs text-dark-400">High</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {totalVulns.medium}
                  </p>
                  <p className="text-xs text-dark-400">Medium</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {totalVulns.low}
                  </p>
                  <p className="text-xs text-dark-400">Low</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500 w-64"
                />
              </div>
              <div className="flex bg-dark-800/50 rounded-lg p-1">
                {["all", "vulnerable", "secure"].map((status) => (
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
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium text-white transition-all">
              <Upload className="w-4 h-4" />
              Scan Image
            </button>
          </div>

          {/* Images List */}
          <div className="space-y-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:bg-dark-800/70 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-dark-700/50 rounded-lg">
                      <Image className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {image.name}
                      </h3>
                      <p className="text-sm text-dark-400">{image.digest}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      image.status === "vulnerable"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {image.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm mb-4">
                  <span className="text-red-400">
                    {image.vulnerabilities.critical} Critical
                  </span>
                  <span className="text-orange-400">
                    {image.vulnerabilities.high} High
                  </span>
                  <span className="text-yellow-400">
                    {image.vulnerabilities.medium} Medium
                  </span>
                  <span className="text-blue-400">
                    {image.vulnerabilities.low} Low
                  </span>
                  <span className="text-dark-400">•</span>
                  <span className="text-dark-300">
                    Scanned {new Date(image.scannedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-white transition-all">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-white transition-all">
                    <Download className="w-4 h-4 inline mr-1" />
                    Report
                  </button>
                  <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400 transition-all">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
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
