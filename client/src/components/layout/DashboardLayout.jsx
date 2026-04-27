import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { ParticleBackground } from "../ui/particle-background";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Top bar for mobile toggle */}
      <div
        className={`fixed top-0 right-0 z-40 h-12 flex items-center px-4 transition-all ${sidebarOpen ? "left-56" : "left-16"}`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main content with particle background */}
      <main
        className={`relative transition-all duration-300 pt-12 ${sidebarOpen ? "ml-56" : "ml-16"}`}
      >
        {/* Subtle particle background across all dashboard pages */}
        <ParticleBackground className="!fixed opacity-20 pointer-events-none" />

        {/* Page content rendered above particles */}
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
