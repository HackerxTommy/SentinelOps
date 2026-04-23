import { Link } from 'react-router-dom';
import { 
  Code, 
  Shield, 
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Zap,
  Github,
  Gitlab,
  Lock,
  FileCode,
  AlertTriangle,
  Terminal,
  Layers
} from 'lucide-react';

export default function CodeAnalysis() {
  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 
    'Ruby', 'PHP', 'C#', 'Swift', 'Kotlin', 'Rust', 'C++'
  ];

  const capabilities = [
    {
      icon: Lock,
      title: 'Secret Detection',
      description: 'Find API keys, passwords, tokens, and credentials hardcoded in your source code'
    },
    {
      icon: AlertTriangle,
      title: 'Vulnerability Detection',
      description: 'Identify SQL injection, XSS, command injection, and other code vulnerabilities'
    },
    {
      icon: Layers,
      title: 'Dependency Scanning',
      description: 'Detect vulnerable dependencies and outdated packages in your project'
    },
    {
      icon: FileCode,
      title: 'CWE Mapping',
      description: 'Automatic mapping to Common Weakness Enumeration (CWE) for standardization'
    }
  ];

  const integrations = [
    { name: 'GitHub', icon: Github, color: 'text-gray-100' },
    { name: 'GitLab', icon: Gitlab, color: 'text-orange-400' }
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
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Static Code Analysis</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Find Vulnerabilities in Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                Source Code
              </span>
            </h1>
            <p className="text-xl text-dark-300 mb-10 max-w-3xl mx-auto">
              SAST (Static Application Security Testing) that analyzes your code for security flaws 
              before deployment. Support for 12+ programming languages.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400">
                <Zap className="w-5 h-5" />
                Scan Your Code
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-dark-400 mb-8">Supported Languages & Frameworks</p>
          <div className="flex flex-wrap justify-center gap-4">
            {languages.map((lang) => (
              <div key={lang} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 font-medium">
                {lang}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">SAST Capabilities</h2>
            <p className="text-dark-400 text-lg">Deep code analysis for comprehensive security</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((cap, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-dark-900/50 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <cap.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{cap.title}</h3>
                  <p className="text-dark-400">{cap.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Seamless Integrations</h2>
            <p className="text-dark-400 text-lg">Connect your repositories in seconds</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="p-6 bg-dark-900/50 border border-white/5 rounded-2xl text-center hover:border-blue-500/30 transition-all">
                <integration.icon className={`w-12 h-12 ${integration.color} mx-auto mb-4`} />
                <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
                <p className="text-dark-400 text-sm">Connect your {integration.name} repositories</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-dark-900/50 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4 mb-6">
              <Terminal className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">CI/CD Integration</h3>
            </div>
            <div className="bg-black rounded-lg p-4 font-mono text-sm text-dark-300 overflow-x-auto">
              <div className="text-dark-500"># GitHub Actions Example</div>
              <div className="text-blue-400">- name: Run SentinelOps SAST</div>
              <div className="text-dark-200 ml-4">uses: SentinelOps/sast-action@v1</div>
              <div className="text-dark-200 ml-4">with:</div>
              <div className="text-dark-200 ml-8">api-token: {`{{ secrets.SentinelOps_TOKEN }}`}</div>
              <div className="text-dark-200 ml-8">language: javascript</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How SAST Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '1', 
                title: 'Code Ingestion', 
                desc: 'Connect your repository or upload source code. We support GitHub, GitLab, Bitbucket, and direct uploads.',
                icon: Github
              },
              { 
                step: '2', 
                title: 'Deep Analysis', 
                desc: 'Our AI-powered engine analyzes your code for vulnerabilities, secrets, and security anti-patterns.',
                icon: Code
              },
              { 
                step: '3', 
                title: 'Actionable Results', 
                desc: 'Get detailed findings with line numbers, code snippets, and remediation guidance.',
                icon: CheckCircle
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-sm font-semibold text-blue-400 mb-2">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-dark-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="p-12 bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/20 rounded-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Secure Your Code Today</h2>
            <p className="text-dark-300 mb-8 max-w-xl mx-auto">
              Connect your repository and get your first scan results in minutes.
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
