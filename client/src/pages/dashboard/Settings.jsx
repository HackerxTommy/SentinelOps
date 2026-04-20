import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { billingAPI } from "../../services/api";
import {
  User,
  Bell,
  Shield as ShieldIcon,
  Key,
  Globe,
  Save,
  CheckCircle2,
  Settings as SettingsIcon,
  CreditCard,
  Zap,
  Check,
} from "lucide-react";

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: "₹2,999",
    features: [
      "50 Scans/month",
      "AI-Powered Analysis",
      "Priority Support",
      "API Access",
      "Team Collaboration",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹9,999",
    features: [
      "Unlimited Scans",
      "Dedicated Support",
      "Custom Integrations",
      "On-premise Option",
      "SLA Guarantee",
    ],
  },
];

export default function Settings() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile",
  );
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: ShieldIcon },
    { id: "api", name: "API Keys", icon: Key },
    { id: "preferences", name: "Preferences", icon: Globe },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true);
      const { data } = await billingAPI.createOrder(planId);

      if (!data.keyId) {
        alert(
          "Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.",
        );
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "SentinelOps",
        description: `${data.plan.name} Plan`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await billingAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            });
            alert("Payment successful! Your plan has been upgraded.");
            window.location.reload();
          } catch (err) {
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: { name: user?.name || "", email: user?.email || "" },
        theme: { color: "#3b82f6" },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert(
          "Razorpay SDK not loaded. Add Razorpay checkout script to index.html.",
        );
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert(error.response?.data?.message || "Failed to initiate upgrade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1">
        <main className="p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-dark-400">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? "bg-brand-500/20 text-brand-300 border border-brand-500/20"
                            : "text-dark-300 hover:bg-dark-700/50 hover:text-dark-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
                {activeTab === "profile" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Profile Settings
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.email?.split("@")[0]}
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          disabled
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-dark-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">
                          Current Plan
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-brand-500/10 border border-brand-500/20 rounded-lg">
                          <Zap className="w-5 h-5 text-brand-400" />
                          <span className="text-brand-100 font-bold uppercase tracking-wider">
                            {user?.plan || "Free"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Notification Preferences
                    </h2>
                    <div className="space-y-4">
                      {[
                        "Email notifications for completed scans",
                        "Email notifications for critical findings",
                        "Push notifications for scan updates",
                        "Weekly security summary reports",
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-white/5"
                        >
                          <span className="text-dark-200">{item}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={index < 2}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Security Settings
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-400 text-sm">
                          Password must be at least 8 characters and include a
                          mix of letters, numbers, and symbols.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "api" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      API Keys
                    </h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-dark-900/50 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">
                            Production API Key
                          </span>
                          <span className="text-green-400 text-xs">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm text-dark-400 bg-dark-800 px-3 py-2 rounded">
                            sk_live_************************
                          </code>
                          <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                            <Key className="w-4 h-4 text-dark-400" />
                          </button>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium text-white transition-all">
                        Generate New API Key
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Preferences
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">
                          Timezone
                        </label>
                        <select className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500">
                          <option>UTC</option>
                          <option>America/New_York</option>
                          <option>Europe/London</option>
                          <option>Asia/Kolkata</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">
                          Language
                        </label>
                        <select className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-white/5">
                        <div>
                          <span className="text-white font-medium">
                            Dark Mode
                          </span>
                          <p className="text-dark-400 text-sm">
                            Use dark theme across the platform
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                  {saved && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Settings saved
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium text-white transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
