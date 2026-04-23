import { Link } from 'react-router-dom';
import { 
  Globe, 
  Shield, 
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Zap,
  AlertTriangle,
  Lock,
  Code,
  FileText,
  Clock,
  Target
} from 'lucide-react';

export default function WebAppSecurity() {
  const vulnerabilities = [
    { name: 'SQL Injection', severity: 'Critical', icon: Code },
    { name: 'XSS (Cross-Site Scripting)', severity: 'High', icon: AlertTriangle },
    { name: 'CSRF', severity: 'High', icon: Lock },
    { name: 'Authentication Bypass', severity: 'Critical', icon: Shield },
    { name: 'Insecure Deserialization', severity: 'High', icon: Code },
    { name: 'Security Misconfiguration', severity: 'Medium', icon: Target },
    { name: 'Sensitive Data Exposure', severity: 'High', icon: FileText },
    { name: 'Broken Access Control', severity: 'Critical', icon: Lock }
  ];

  const features = [
    {
      title: 'Dynamic Testing',
      description: 'Test your running application with real attack simulations'
    },
    {
      title: 'OWASP Top 10',
      description: 'Comprehensive coverage of the latest OWASP vulnerabilities'
    },
    {
      title: 'Zero False Positives',
      description: 'AI-powered validation confirms every finding'
    },
    {
      title: 'Proof of Concept',
      description: 'Each vulnerability includes a working exploit proof'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SentinelOps</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/services" className="text-dark-300 hover:text-white transition-colors">Services</Link>
              <Link to="/auth" className="btn-primary flex items-center gap-2 text-sm">
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Web Application Security</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6">
                DAST Testing for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Modern Web Apps
                </span>
              </h1>
              <p className="text-xl text-dark-300 mb-8">
                Dynamic Application Security Testing that finds vulnerabilities in your running applications. 
                Our AI agents crawl, analyze, and attack your web apps like real hackers.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/register" className="btn-primary flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400">
                  <Zap className="w-5 h-5" />
                  Start Free Scan
                </Link>
                <div className="text-dark-400 text-sm">
                  <Clock className="w-4 h-4 inline mr-1" />
                  15-45 min scan time
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="relative bg-dark-900/50 border border-white/5 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-dark-400 text-sm">https://your-app.com</span>
                </div>
                <div className="space-y-3">
                  {vulnerabilities.slice(0, 4).map((vuln, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg">
                      <vuln.icon className="w-5 h-5 text-red-400" />
                      <span className="text-dark-200 text-sm flex-1">{vuln.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {vuln.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vulnerabilities Covered */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Vulnerabilities We Detect</h2>
            <p className="text-dark-400 text-lg">Comprehensive OWASP Top 10 coverage</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vulnerabilities.map((vuln, index) => (
              <div key={index} className="p-4 bg-dark-900/50 border border-white/5 rounded-xl hover:border-blue-500/30 transition-all">
                <div className="flex items-start gap-3">
                  <vuln.icon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{vuln.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                      vuln.severity === 'High' ? 'bg-orange-500/20 text-orange-400' : 
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {vuln.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How DAST Works</h2>
            <p className="text-dark-400 text-lg">Four steps to complete security coverage</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Discovery', desc: 'AI crawlers map your entire application' },
              { step: '2', title: 'Analysis', desc: 'Identify entry points and attack surfaces' },
              { step: '3', title: 'Attack', desc: 'Run intelligent exploit simulations' },
              { step: '4', title: 'Validate', desc: 'Confirm findings with proof of concept' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-dark-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-dark-900/50 border border-white/5 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-dark-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="p-12 bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/20 rounded-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Web Apps?</h2>
            <p className="text-dark-300 mb-8 max-w-xl mx-auto">
              Start with a free scan and see what vulnerabilities exist in your application.
            </p>
            <Link to="/auth" className="btn-primary inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400">
              Start Free Scan
              <ArrowRight className="w-5 h-5" />
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
