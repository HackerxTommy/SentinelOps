import { Bell, Search, User, ChevronDown, Menu, Command } from "lucide-react";

export default function Header({ user, onMenuToggle }) {
  return (
    <header className="h-20 bg-dark-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuToggle}
          className="p-2.5 rounded-xl bg-dark-800/50 hover:bg-dark-800 border border-white/5 hover:border-white/10 transition-all duration-300"
        >
          <Menu className="w-5 h-5 text-dark-300" />
        </button>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search scans, findings, reports..."
            className="w-96 pl-12 pr-12 py-3 bg-dark-850/80 border border-white/5 rounded-xl text-dark-100 placeholder-dark-400 focus:outline-none focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 hover:border-white/10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-dark-800 rounded-lg border border-white/5">
            <Command className="w-3 h-3 text-dark-400" />
            <span className="text-xs text-dark-400 font-medium">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 border border-white/5 hover:border-white/10 transition-all duration-300 group">
          <Bell className="w-5 h-5 text-dark-300 group-hover:text-dark-100 transition-colors" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-severity-critical rounded-full border-2 border-dark-900"></span>
        </button>

        <div className="flex items-center gap-4 pl-4 border-l border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500/20 to-brand-600/20 rounded-full flex items-center justify-center border border-brand-500/20">
              <User className="w-5 h-5 text-brand-400" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-dark-50">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-dark-400 capitalize">
                {user?.role || "Security Analyst"}
              </p>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-dark-800/50 transition-colors">
            <ChevronDown className="w-4 h-4 text-dark-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
