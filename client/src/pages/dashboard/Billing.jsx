import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { Check, CreditCard, Shield, Zap } from "lucide-react";
import { billingAPI } from "../../services/api";

const plans = [
  {
    id: "free",
    name: "Starter",
    price: "0",
    icon: Shield,
    features: [
      "5 Scans per month",
      "Basic Vulnerability Detection",
      "Community Support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "49",
    icon: Zap,
    popular: true,
    features: [
      "50 Scans per month",
      "AI-Powered Auto-Fix",
      "Priority Support",
      "API Access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "199",
    icon: CreditCard,
    features: [
      "Unlimited Scans",
      "Dedicated Account Manager",
      "Custom Integrations",
      "SLA Guarantee",
    ],
  },
];

export default function Billing() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
              Billing & Plans
            </h1>
            <p className="text-dark-400">
              Manage your subscription and billing details
            </p>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Subscription Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border transition-all ${
                    plan.popular
                      ? "bg-brand-600/10 border-brand-500/50"
                      : "bg-dark-900/50 border-white/5"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-500 text-white text-[10px] font-bold uppercase rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-dark-400 text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-dark-300"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading || user?.plan === plan.id}
                    className={`w-full py-2.5 rounded-xl font-semibold transition-all ${
                      user?.plan === plan.id
                        ? "bg-green-500/20 text-green-400 border border-green-500/20 cursor-default"
                        : "bg-brand-600 hover:bg-brand-500 text-white"
                    }`}
                  >
                    {user?.plan === plan.id ? "Current Plan" : "Upgrade Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
