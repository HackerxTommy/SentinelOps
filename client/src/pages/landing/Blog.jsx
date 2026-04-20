import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, Calendar, Clock, Tag,
  Shield, Bug, Terminal, Code, Globe, Lock,
  AlertTriangle, FileText, Cpu, Zap
} from 'lucide-react';
import logo from '@/assets/logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' }
  })
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};

const categories = ['All', 'Security Research', 'Product Updates', 'Tutorials', 'Industry News'];

const posts = [
  {
    id: 1,
    title: 'Critical Authentication Bypass Found in etcd: How AI Discovered What Humans Missed',
    category: 'Security Research',
    author: 'SentinelOps Research',
    date: 'Apr 28, 2026',
    readTime: '8 min',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    badge: 'CVE-2026-33281',
    badgeColor: 'bg-red-500/20 text-red-400',
    excerpt: 'Our autonomous scanning agent discovered a critical authentication bypass in etcd v3.5.x that allows unauthenticated access to sensitive cluster data via crafted JWT tokens. CVSS 9.1.',
    featured: true,
  },
  {
    id: 2,
    title: 'SQL Injection Through GraphQL Introspection: A Novel Attack Vector',
    category: 'Security Research',
    author: 'Priya Sharma',
    date: 'Apr 22, 2026',
    readTime: '10 min',
    icon: Bug,
    iconColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    badge: 'HIGH 8.6',
    badgeColor: 'bg-orange-500/20 text-orange-400',
    excerpt: 'We discovered a novel attack vector that leverages GraphQL introspection queries to inject SQL payloads into underlying database resolvers. Affects 14% of production GraphQL APIs tested.',
  },
  {
    id: 3,
    title: 'Introducing SentinelOps v2.0: Autonomous Penetration Testing',
    category: 'Product Updates',
    author: 'SentinelOps Team',
    date: 'Apr 15, 2026',
    readTime: '5 min',
    icon: Zap,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    badge: 'v2.0',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    excerpt: 'The biggest SentinelOps release yet. Our AI agents now autonomously perform full penetration tests — from reconnaissance to exploitation to reporting — in under 2 hours.',
  },
  {
    id: 4,
    title: 'Setting Up Automated Security Scanning in Your CI/CD Pipeline',
    category: 'Tutorials',
    author: 'Dev Team',
    date: 'Apr 10, 2026',
    readTime: '12 min',
    icon: Terminal,
    iconColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    badge: 'Tutorial',
    badgeColor: 'bg-green-500/20 text-green-400',
    excerpt: 'Step-by-step guide to integrating SentinelOps into GitHub Actions, GitLab CI, and Jenkins pipelines. Block deployments with critical vulnerabilities automatically.',
  },
  {
    id: 5,
    title: 'The State of API Security in 2026: Findings From 50,000 Scans',
    category: 'Industry News',
    author: 'SentinelOps Research',
    date: 'Apr 5, 2026',
    readTime: '15 min',
    icon: Globe,
    iconColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    badge: 'Report',
    badgeColor: 'bg-cyan-500/20 text-cyan-400',
    excerpt: 'Analysis of 50,000+ API security scans reveals that 67% of production APIs have at least one critical vulnerability. Broken authentication remains the #1 issue.',
  },
  {
    id: 6,
    title: 'Hardcoded AWS Keys in Open Source: A Growing Supply Chain Risk',
    category: 'Security Research',
    author: 'Arjun Patel',
    date: 'Mar 28, 2026',
    readTime: '7 min',
    icon: Lock,
    iconColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    badge: 'Research',
    badgeColor: 'bg-yellow-500/20 text-yellow-400',
    excerpt: 'Our scan of 100,000 public GitHub repositories found 3,200+ valid AWS access keys. We responsibly disclosed all findings and worked with GitHub to revoke them.',
  },
  {
    id: 7,
    title: 'Understanding OWASP Top 10 2025: What Changed and Why It Matters',
    category: 'Tutorials',
    author: 'SentinelOps Team',
    date: 'Mar 20, 2026',
    readTime: '9 min',
    icon: FileText,
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    badge: 'Guide',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    excerpt: 'A comprehensive breakdown of the updated OWASP Top 10 for 2025, including new entries like Server-Side Request Forgery and how SentinelOps tests for each category.',
  },
  {
    id: 8,
    title: 'AI in Offensive Security: How LLMs Are Changing Penetration Testing',
    category: 'Industry News',
    author: 'SentinelOps Research',
    date: 'Mar 12, 2026',
    readTime: '11 min',
    icon: Cpu,
    iconColor: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    badge: 'Analysis',
    badgeColor: 'bg-pink-500/20 text-pink-400',
    excerpt: 'How large language models are being used to automate vulnerability discovery, generate exploit payloads, and reason about complex attack chains in modern web applications.',
  },
  {
    id: 9,
    title: 'Securing Kubernetes: Common Misconfigurations That Lead to Cluster Takeover',
    category: 'Tutorials',
    author: 'Priya Sharma',
    date: 'Mar 5, 2026',
    readTime: '14 min',
    icon: Code,
    iconColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    badge: 'Tutorial',
    badgeColor: 'bg-indigo-500/20 text-indigo-400',
    excerpt: 'Analysis of the most common Kubernetes security misconfigurations including overly permissive RBAC, exposed dashboards, and insecure pod security policies.',
  },
];

const Logo = ({ size = 32 }) => (
  <img src={logo} alt="SentinelOps" width={size} height={size} className="rounded-lg" />
);

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = posts.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  const featured = filtered.find(p => p.featured);
  const regular = filtered.filter(p => !p.featured);

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
                <Link key={item} to={`/${item.toLowerCase()}`} className={`px-4 py-2 text-sm transition-colors ${item === 'Blog' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{item}</Link>
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

      {/* ═══════════════ HEADER ═══════════════ */}
      <section className="pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">From the Blog</h1>
                <p className="text-gray-400">Security research, product updates, and engineering insights</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/40 transition-colors"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap mb-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURED POST ═══════════════ */}
      {featured && (
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all cursor-pointer"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${featured.badgeColor}`}>{featured.badge}</span>
                    <span className="text-xs text-gray-500">{featured.category}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">{featured.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime} read</span>
                    <span>{featured.author}</span>
                  </div>
                </div>
                <div className={`h-48 ${featured.bgColor} rounded-xl flex items-center justify-center`}>
                  <div className="text-center">
                    <featured.icon className={`w-12 h-12 ${featured.iconColor} mx-auto mb-3`} />
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${featured.badgeColor}`}>{featured.badge}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ POST GRID ═══════════════ */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {regular.map((post, i) => (
              <motion.article
                key={post.id}
                variants={fadeUp}
                custom={i}
                className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className={`h-40 ${post.bgColor} flex items-center justify-center border-b border-white/5`}>
                  <div className="text-center">
                    <post.icon className={`w-8 h-8 ${post.iconColor} mx-auto mb-2`} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.badgeColor}`}>{post.badge}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{post.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-600">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[9px] font-bold text-gray-400">
                      {post.author.charAt(0)}
                    </div>
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No posts match your search. Try different keywords.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER CTA ═══════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Stay ahead of threats</h2>
            <p className="text-sm text-gray-400 mb-6">Get the latest security research and product updates delivered to your inbox.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/40"
              />
              <button className="px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
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
