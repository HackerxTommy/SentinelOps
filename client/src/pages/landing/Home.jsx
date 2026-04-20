import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Globe, GitBranch, Activity,
  ChevronRight, CheckCircle, Play, Target, Code, Server, ArrowRight,
  Shield, Scan, Lock, BarChart3, Users, Clock
} from 'lucide-react';
import { HeroOdyssey } from '@/components/ui/hero-odyssey';
import logo from '@/assets/logo.png';

/* ── Framer variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } }
};
const itemV = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Logo = ({ size = 32 }) => (
  <img src={logo} alt="SentinelOps" width={size} height={size} className="rounded-lg" />
);

export default function Home() {
  const features = [
    { icon: Zap, title: 'AI-Powered Scanning', desc: 'Autonomous AI agents that find vulnerabilities like real hackers would' },
    { icon: Target, title: 'Penetration Testing', desc: 'Black-box and white-box pentesting for web apps, APIs, and infrastructure' },
    { icon: Code, title: 'Code Analysis (SAST)', desc: 'Static analysis for repositories with GitHub and GitLab integration' },
    { icon: Server, title: 'Infrastructure Security', desc: 'Cloud security assessment for AWS, GCP, and Azure environments' },
    { icon: GitBranch, title: 'CI/CD Integration', desc: 'Automated security gates inside your development pipeline' },
    { icon: Activity, title: 'Real-time Monitoring', desc: 'Continuous attack surface monitoring with instant alerting' },
  ];

  const services = [
    { icon: Globe, title: 'Web App Security', desc: 'DAST scanning for OWASP Top 10', time: '15-45 min' },
    { icon: Shield, title: 'API Security', desc: 'REST & GraphQL endpoint testing', time: '10-30 min' },
    { icon: Code, title: 'Code Analysis', desc: 'Multi-language SAST scanning', time: '5-20 min' },
    { icon: Scan, title: 'Reconnaissance', desc: 'Asset discovery & enumeration', time: '10-25 min' },
    { icon: Server, title: 'Cloud Security', desc: 'Misconfiguration detection', time: '20-60 min' },
    { icon: Target, title: 'AI Pentesting', desc: 'Autonomous penetration testing', time: '30-120 min' },
  ];

  const stats = [
    { value: '50K+', label: 'Vulnerabilities Found', icon: Shield },
    { value: '10K+', label: 'Security Scans', icon: Scan },
    { value: '99.9%', label: 'Uptime SLA', icon: Activity },
    { value: '<1hr', label: 'Avg Scan Time', icon: Clock },
  ];

  const testimonials = [
    { quote: "SentinelOps found critical vulnerabilities we missed for months. Absolute game changer for our team.", author: "Sarah Chen", role: "CISO, TechCorp" },
    { quote: "The AI-powered approach reduced our pentest time from weeks to hours. Nothing else comes close.", author: "Michael Ross", role: "Security Lead, FinStack" },
    { quote: "Best security investment we've ever made. Professional grade at a fraction of the cost.", author: "Emily Watson", role: "CTO, CloudBase" },
  ];

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
                <Link key={item} to={`/${item.toLowerCase()}`} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">{item}</Link>
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

      {/* ═══════════════ HERO WITH LIGHTNING ═══════════════ */}
      <HeroOdyssey>
        <motion.button
          variants={itemV}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6 transition-all duration-300 group"
        >
          <span>Now with AI-powered pentesting</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transform group-hover:translate-x-1 transition-transform duration-300">
            <path d="M8 3L13 8L8 13M13 8H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <motion.h1 variants={itemV} className="text-5xl md:text-7xl font-light mb-2">
          SentinelOps
        </motion.h1>

        <motion.h2 variants={itemV} className="text-3xl md:text-5xl pb-3 font-light bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
          Penetration Testing in Hours
        </motion.h2>

        <motion.p variants={itemV} className="text-gray-400 mb-8 max-w-2xl">
          AI agents that find and fix vulnerabilities before they reach production. Connect your repos and domains, and launch a pentest in minutes.
        </motion.p>

        <motion.div variants={itemV} className="flex flex-col sm:flex-row items-center gap-3">
          <Link to="/auth" className="group flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full font-semibold transition-all hover:bg-gray-100 text-sm">
            <Play className="w-4 h-4" />
            Start Free Trial
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/services" className="flex items-center gap-2 px-7 py-3.5 border border-white/10 hover:border-white/20 rounded-full text-gray-300 hover:text-white transition-all text-sm">
            <Globe className="w-4 h-4" />
            View Services
          </Link>
        </motion.div>

        <motion.div variants={itemV} className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" />No credit card</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" />14-day trial</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" />Cancel anytime</span>
        </motion.div>
      </HeroOdyssey>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-16 border-y border-white/5">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} className="text-center">
              <s.icon className="w-5 h-5 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Security Services</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Complete security testing suite — from web apps to cloud infrastructure, powered by autonomous AI agents.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="group p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                    <s.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-full">{s.time}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Built for Modern Security Teams</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need in one platform. From scanning to reporting.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="group p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500/10 transition-colors">
                  <f.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-gray-500">Get started in minutes, not days</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Connect Your Assets', desc: 'Add your web apps, APIs, or connect your GitHub repositories.' },
              { num: '02', title: 'Launch AI Scan', desc: 'Our agents autonomously explore, crawl, and test your applications.' },
              { num: '03', title: 'Get Actionable Reports', desc: 'Receive prioritized findings with PoCs and remediation guidance.' },
            ].map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} custom={i} className="text-center">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/10">
                  <span className="text-xl font-bold text-white">{step.num}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Trusted by Security Teams</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                <p className="text-sm text-gray-300 mb-5 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.author}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
              <h2 className="text-2xl font-bold text-white mb-3">Ready to Secure Your Applications?</h2>
              <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                Join thousands of teams using SentinelOps to find and fix vulnerabilities before attackers do.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/auth" className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-100 transition-all">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/enterprise" className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all">
                  Contact Sales
                </Link>
              </div>
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
