import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LampContainer } from '@/components/ui/lamp';
import logo from '@/assets/logo.png';
import { 
  Shield, 
  Zap, 
  Target, 
  Code, 
  Globe, 
  GitBranch, 
  Lock,
  Scan,
  FileText,
  Activity,
  Users,
  Clock,
  ChevronRight,
  CheckCircle,
  Server,
  Database,
  Cloud,
  Terminal
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Security Testing',
      description: 'Autonomous AI agents that act like real hackers, exploring your applications dynamically to find vulnerabilities that static scanners miss.',
      highlights: ['Autonomous exploration', 'Dynamic testing', 'Proof of concept generation', 'Zero false positives']
    },
    {
      icon: Target,
      title: 'Web Application Security (DAST)',
      description: 'Comprehensive dynamic application security testing for modern web apps. Find vulnerabilities in running applications.',
      highlights: ['OWASP Top 10 coverage', 'XSS & SQL injection detection', 'Authentication testing', 'Session management flaws']
    },
    {
      icon: Code,
      title: 'Static Code Analysis (SAST)',
      description: 'Deep code analysis for repositories to find security flaws before deployment. Support for all major languages.',
      highlights: ['Multi-language support', 'Secret detection', 'Vulnerable dependency scanning', 'CWE mapping']
    },
    {
      icon: Globe,
      title: 'API Security Testing',
      description: 'Specialized testing for REST and GraphQL APIs. Validate authentication, authorization, and input validation.',
      highlights: ['REST & GraphQL support', 'JWT testing', 'Rate limit validation', 'Schema validation']
    },
    {
      icon: Server,
      title: 'Infrastructure & Cloud',
      description: 'Cloud and infrastructure security assessment capabilities for AWS, Azure, and GCP configurations.',
      highlights: ['Cloud misconfiguration detection', 'IAM policy analysis', 'Network security', 'Container scanning']
    },
    {
      icon: Scan,
      title: 'Reconnaissance & Asset Discovery',
      description: 'Automated asset discovery and fingerprinting. Map your entire attack surface.',
      highlights: ['Subdomain enumeration', 'Technology fingerprinting', 'Port scanning', 'SSL/TLS analysis']
    }
  ];

  const capabilities = [
    {
      icon: GitBranch,
      title: 'CI/CD Integration',
      description: 'Seamlessly integrate security testing into your development pipeline with GitHub Actions, GitLab CI, and more.'
    },
    {
      icon: FileText,
      title: 'Comprehensive Reporting',
      description: 'Generate professional PDF, HTML, and JSON reports with detailed findings and remediation guidance.'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Continuous security monitoring with instant alerts when new vulnerabilities are discovered.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share findings with your team, assign remediation tasks, and track progress.'
    },
    {
      icon: Lock,
      title: 'Compliance & Standards',
      description: 'Map findings to OWASP Top 10, CWE Top 25, PCI DSS, SOC 2, and other frameworks.'
    },
    {
      icon: Clock,
      title: 'Scheduled Scanning',
      description: 'Set up automated recurring scans to ensure continuous security posture monitoring.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="SentinelOps" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold text-white">SentinelOps</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
              <Link to="/auth" className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Lamp Hero */}
      <LampContainer className="pt-16">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-br from-gray-100 to-gray-400 py-4 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl"
        >
          Everything You Need for
          <br />
          Modern Security
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gray-400 text-lg mt-4 max-w-2xl text-center"
        >
          Comprehensive security testing powered by AI. From code to cloud, we've got you covered.
        </motion.p>
      </LampContainer>

      {/* Core Features */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Security Features</h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Six powerful security testing modules to protect your entire stack
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-dark-900/50 border border-white/5 rounded-2xl hover:border-brand-500/20 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-brand-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-dark-400 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-dark-300">
                          <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-dark-400 text-lg">Built for modern development workflows</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => (
              <div key={index} className="p-6 bg-dark-900/50 border border-white/5 rounded-2xl hover:border-brand-500/20 transition-all">
                <cap.icon className="w-8 h-8 text-brand-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{cap.title}</h3>
                <p className="text-dark-400 text-sm">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Supported Technologies</h2>
            <p className="text-dark-400 text-lg">Works with your entire stack</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Go', 'Ruby', 'Java', 'PHP', 'Docker', 'Kubernetes', 'AWS'].map((tech) => (
              <div key={tech} className="p-4 bg-dark-900/50 border border-white/5 rounded-xl text-center">
                <span className="text-dark-200 font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="p-12 bg-gradient-to-br from-brand-600/20 to-brand-900/20 border border-brand-500/20 rounded-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to See All Features in Action?</h2>
            <p className="text-dark-300 mb-8 max-w-xl mx-auto">
              Start your free trial today and experience enterprise-grade security testing.
            </p>
            <Link to="/auth" className="btn-primary inline-flex items-center gap-2">
              Start Free Trial
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">SentinelOps</span>
            </div>
            <p className="text-dark-500 text-sm">
              © 2026 SentinelOps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
