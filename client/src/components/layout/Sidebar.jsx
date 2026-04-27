import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "@/assets/logo.png";
import {
  LayoutDashboard,
  Shield,
  GitPullRequest,
  AlertTriangle,
  MessageSquare,
  GitBranch,
  Globe,
  Clock,
  BookOpen,
  Puzzle,
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
  ChevronRight,
  Zap,
  FileText,
  List,
  Radar,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Pentests", icon: Shield, path: "/pentests" },
  { name: "Scheduled", icon: Clock, path: "/scheduled" },
  { name: "PR Reviews", icon: GitPullRequest, path: "/pr-reviews" },
  { name: "Issues", icon: AlertTriangle, path: "/issues" },
  { name: "Chat", icon: MessageSquare, path: "/chat" },
  { name: "Repositories", icon: GitBranch, path: "/repositories" },
  { name: "Domains", icon: Globe, path: "/domains" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "Audit Reports", icon: List, path: "/audit-reports" },
  { name: "Attack Surface", icon: Radar, path: "/attack-surface" },
  { name: "Integrations", icon: Puzzle, path: "/integrations" },
  { name: "Billing", icon: CreditCard, path: "/billing" },
  { name: "Settings", icon: Settings, path: "/settings", hasSubmenu: true },
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside
      className={`
      fixed left-0 top-0 h-screen bg-black backdrop-blur-xl 
      border-r border-white/5 z-50
      transition-all duration-300 ease-in-out
      ${isOpen ? "w-56" : "w-16"}
    `}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden">
            <img
              src={logo}
              alt="SentinelOps"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          {isOpen && (
            <span className="text-sm font-bold text-white tracking-tight">
              SentinelOps
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            if (item.hasSubmenu) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() =>
                      isOpen
                        ? setSettingsOpen(!settingsOpen)
                        : navigate(item.path)
                    }
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                      ${isActive ? "bg-white/10 text-white" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}
                    `}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${settingsOpen ? "rotate-90" : ""}`}
                        />
                      </>
                    )}
                  </button>
                  {isOpen && settingsOpen && (
                    <div className="ml-6 mt-0.5 space-y-0.5">
                      {[
                        { name: "General", path: "/settings" },
                        { name: "API Keys", path: "/settings?tab=api" },
                      ].map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className="block px-3 py-1.5 text-xs text-gray-500 hover:text-white rounded-md hover:bg-white/5"
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                  ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                  }
                `}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Start free trial */}
        {isOpen && (
          <div className="px-3 mb-2">
            <button
              onClick={() => navigate("/billing")}
              className="w-full text-left text-xs text-gray-500 hover:text-blue-400 transition-colors py-2"
            >
              Start free trial
            </button>
          </div>
        )}

        {/* User + Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => {
              logout();
              navigate("/auth");
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-gray-500 hover:bg-white/5 hover:text-red-400 transition-all text-sm"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
