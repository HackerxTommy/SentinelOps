import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle, ArrowRight, Zap, Shield, HelpCircle,
  ChevronDown, ChevronUp, Star
} from 'lucide-react';
import logo from '@/assets/logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } }
};

const plans = [
  {
    name: 'Free', monthly: '₹0', annual: '₹0', period: '/month', cta: 'Get Started', popular: false,
    features: ['1 domain scan/month', '5 findings per scan', 'Community support', 'Basic reports', 'Single user'],
    description: 'Perfect for exploring SentinelOps'
  },
  {
    name: 'Starter', monthly: '₹3,999', annual: '₹3,199', period: '/month', cta: 'Start Free Trial', popular: false,
    features: ['10 domain scans/month', 'Unlimited findings', 'Email support', 'CI/CD integration', 'API access', 'Team dashboard'],
    description: 'For small teams getting started'
  },
  {
    name: 'Pro', monthly: '₹11,999', annual: '₹9,599', period: '/month', cta: 'Start Free Trial', popular: true,
    features: ['Unlimited scans', 'PR code reviews', 'AI-powered auto-fix', 'Priority support', 'Custom reports', 'Team management', 'Slack integration', 'Audit reports'],
    description: 'For growing security teams'
  },
  {
    name: 'Enterprise', monthly: 'Custom', annual: 'Custom', period: '', cta: 'Contact Sales', popular: false,
    features: ['Private deployment', 'Bring your own AI model', 'Dedicated account manager', 'SLA guarantee', 'SOC 2 compliance', 'Custom integrations', 'SSO / SAML', 'On-premise option'],
    description: 'For organizations at scale'
  },
];

const faqs = [
  { q: 'How does the free plan work?', a: 'The free plan includes 1 domain scan per month with up to 5 findings. No credit card required. You can upgrade anytime to unlock more scans and features.' },
  { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated for the remainder of the billing cycle.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, UPI, and net banking via Razorpay. Enterprise customers can also pay via wire transfer or purchase order.' },
  { q: 'Is there a discount for annual billing?', a: 'Yes! Annual billing saves you 20% compared to monthly billing. The discount is applied automatically when you switch to annual billing.' },
  { q: 'Do you offer a free trial?', a: 'Yes, all paid plans come with a 14-day free trial. No credit card required. You can cancel anytime during the trial period.' },
  { q: 'What happens when my trial ends?', a: 'When your trial ends, you will be moved to the Free plan automatically unless you choose to subscribe. No charges are applied without your consent.' },
];

const Logo = ({ size = 32 }) => (
  <img src={logo} alt="SentinelOps" width={size} height={size} className="rounded-lg" />
);

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-black font-sans text-white">

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-black/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo />
              <span className="text-lg font-bold text-white tracking-tight">SentinelOps</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {['Features', 'Services', 'Pricing', 'Blog'].map(item => (
                <Link key={item} to={`/${item.toLowerCase()}`} className={`px-4 py-2 text-sm transition-colors ${item === 'Pricing' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{item}</Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth" className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
              <Link to="/auth" className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Save 20% with annual billing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
              Start free. Scale as your team grows. No hidden fees.
            </p>
          </motion.div>

          {/* Toggle */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="inline-flex p-1 bg-white/5 border border-white/10 rounded-full mb-12">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${isAnnual ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Annual
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">-20%</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PLAN CARDS ═══════════════ */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                custom={i}
                className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? 'bg-white/[0.04] border-2 border-blue-500/30 shadow-lg shadow-blue-500/5'
                    : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-500">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">{isAnnual ? plan.annual : plan.monthly}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                  {isAnnual && plan.monthly !== 'Custom' && plan.monthly !== '₹0' && (
                    <p className="text-xs text-gray-600 mt-1 line-through">{plan.monthly}/month</p>
                  )}
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/auth"
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ COMPARISON ═══════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Compare Plans</h2>
            <p className="text-gray-500">See what's included in each plan</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 text-gray-400 font-medium">Feature</th>
                  {plans.map(p => (
                    <th key={p.name} className="text-center py-4 text-white font-semibold">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  { feature: 'Scans per month', vals: ['1', '10', 'Unlimited', 'Unlimited'] },
                  { feature: 'Findings per scan', vals: ['5', 'Unlimited', 'Unlimited', 'Unlimited'] },
                  { feature: 'CI/CD integration', vals: ['—', '✓', '✓', '✓'] },
                  { feature: 'PR code reviews', vals: ['—', '—', '✓', '✓'] },
                  { feature: 'AI auto-fix', vals: ['—', '—', '✓', '✓'] },
                  { feature: 'Custom reports', vals: ['—', '—', '✓', '✓'] },
                  { feature: 'SSO / SAML', vals: ['—', '—', '—', '✓'] },
                  { feature: 'SLA guarantee', vals: ['—', '—', '—', '✓'] },
                ].map(row => (
                  <tr key={row.feature} className="border-b border-white/5">
                    <td className="py-3 text-gray-300">{row.feature}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} className={`text-center py-3 ${v === '✓' ? 'text-green-400' : v === '—' ? 'text-gray-600' : 'text-white'}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-1">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-gray-500" />
                    : <ChevronDown className="w-4 h-4 text-gray-500" />
                  }
                </button>
                {openFaq === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm text-gray-400 leading-relaxed pb-5"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative p-10 bg-white/[0.02] border border-white/10 rounded-2xl text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
            <div className="relative">
              <Shield className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
              <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                Talk to our sales team to find the right plan for your organization.
              </p>
              <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-100 transition-all">
                Contact Sales <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Logo size={24} />
              <span className="text-sm font-bold text-white">SentinelOps</span>
            </div>
            <div className="flex items-center gap-5 text-xs text-gray-500">
              {['Services', 'Pricing', 'Blog', 'Features', 'Enterprise'].map(item => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
            <p className="text-xs text-gray-600">© 2026 SentinelOps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
