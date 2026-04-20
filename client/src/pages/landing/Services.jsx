import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { 
  Shield, 
  Globe, 
  Code, 
  Server, 
  Scan,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Zap,
  FileText,
  Activity,
  Lock,
  Terminal,
  Target,
  Clock
} from 'lucide-react';

export default function Services() {
  const services = [
    {
      id: 'web-security',
      icon: Globe,
      title: 'Web Application Security Testing',
      shortTitle: 'Web App Security',
      description: 'Comprehensive DAST (Dynamic Application Security Testing) for modern web applications. Our AI agents crawl and attack your web apps just like real hackers would.',
      features: [
        'OWASP Top 10 comprehensive coverage',
        'SQL Injection & NoSQL Injection detection',
        'Cross-Site Scripting (XSS) identification',
        'Authentication & authorization flaws',
        'Business logic vulnerability testing',
        'API endpoint discovery & testing',
        'Session management testing',
        'CSRF & Clickjacking detection'
      ],
      useCases: ['E-commerce platforms', 'SaaS applications', 'Internal dashboards', 'Customer portals'],
      pricing: 'Starting at $99/month',
      scanTime: '15-45 minutes',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'api-security',
      icon: Terminal,
      title: 'API Security Testing',
      shortTitle: 'API Security',
      description: 'Specialized security testing for RESTful and GraphQL APIs. Validate your API security posture against industry best practices and standards.',
      features: [
        'REST API security validation',
        'GraphQL query/mutation testing',
        'JWT & OAuth token security',
        'Rate limiting & throttling tests',
        'Input validation & sanitization',
        'Authentication bypass attempts',
        'Authorization & privilege escalation',
        'API schema validation'
      ],
      useCases: ['Microservices architectures', 'Mobile app backends', 'Public API endpoints', 'Internal APIs'],
      pricing: 'Starting at $79/month',
      scanTime: '10-30 minutes',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'code-analysis',
      icon: Code,
      title: 'Static Code Analysis (SAST)',
      shortTitle: 'Code Analysis',
      description: 'Deep static analysis of source code to identify security vulnerabilities before deployment. Support for all major programming languages and frameworks.',
      features: [
        'Multi-language code analysis',
        'Secret & credential detection',
        'Vulnerable dependency scanning',
        'CWE Top 25 vulnerability mapping',
        'Hardcoded password detection',
        'Insecure cryptography usage',
        'Code injection vulnerabilities',
        'Security anti-patterns detection'
      ],
      useCases: ['GitHub repositories', 'GitLab projects', 'Bitbucket repos', 'CI/CD pipelines'],
      pricing: 'Starting at $49/month',
      scanTime: '5-20 minutes',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'reconnaissance',
      icon: Scan,
      title: 'Reconnaissance & Asset Discovery',
      shortTitle: 'Asset Discovery',
      description: 'Automated asset discovery and reconnaissance to map your entire attack surface. Find forgotten subdomains, exposed services, and infrastructure gaps.',
      features: [
        'Subdomain enumeration & discovery',
        'Technology stack fingerprinting',
        'Port scanning & service detection',
        'SSL/TLS configuration analysis',
        'DNS security assessment',
        'Cloud asset discovery',
        'Exposed service detection',
        'Security header analysis'
      ],
      useCases: ['Domain portfolios', 'M&A security assessments', 'Shadow IT discovery', 'Attack surface mapping'],
      pricing: 'Starting at $59/month',
      scanTime: '10-25 minutes',
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'infrastructure',
      icon: Server,
      title: 'Infrastructure Security',
      shortTitle: 'Infrastructure',
      description: 'Cloud and infrastructure security assessment for AWS, Azure, and GCP. Detect misconfigurations before attackers do.',
      features: [
        'Cloud misconfiguration detection',
        'IAM policy & permission analysis',
        'Network security assessment',
        'Container & Kubernetes security',
        'S3 bucket & storage security',
        'Database security scanning',
        'Serverless function testing',
        'Compliance checking (CIS benchmarks)'
      ],
      useCases: ['AWS environments', 'Azure deployments', 'GCP projects', 'Multi-cloud setups'],
      pricing: 'Starting at $149/month',
      scanTime: '20-60 minutes',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      id: 'pentest',
      icon: Target,
      title: 'AI-Powered Penetration Testing',
      shortTitle: 'AI Pentesting',
      description: 'Autonomous AI agents that perform comprehensive penetration testing. Combines all testing methodologies for maximum coverage.',
      features: [
        'Autonomous vulnerability discovery',
        'Proof-of-concept generation',
        'Exploit chain analysis',
        'Zero false positive guarantee',
        'Continuous security validation',
        'Intelligent payload generation',
        'Context-aware testing',
        'Prioritized remediation guidance'
      ],
      useCases: ['Enterprise applications', 'Critical infrastructure', 'Financial systems', 'Healthcare platforms'],
      pricing: 'Starting at $299/month',
      scanTime: '30-120 minutes',
      iconColor: 'text-brand-400',
      bgColor: 'bg-brand-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="SentinelOps" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold text-white tracking-tight">SentinelOps</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {['Features', 'Services', 'Pricing', 'Blog'].map(item => (
                <Link key={item} to={`/${item.toLowerCase()}`} className={`px-4 py-2 text-sm transition-colors ${item === 'Services' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{item}</Link>
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
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-black to-black" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full mb-8">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-brand-300">Complete Security Suite</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Security Services for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">
              Every Need
            </span>
          </h1>
          <p className="text-xl text-dark-300 max-w-3xl mx-auto mb-10">
            From web applications to cloud infrastructure, we provide comprehensive security testing services powered by AI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#services" className="btn-secondary flex items-center gap-2">
              View Services
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Security Services</h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Choose the services that fit your security needs, or combine them for complete coverage
            </p>
          </div>

          <div className="space-y-8">
            {services.map((service, index) => (
              <div key={service.id} className="p-8 bg-dark-900/50 border border-white/5 rounded-2xl hover:border-brand-500/20 transition-all">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left - Title & Description */}
                  <div className="lg:col-span-1">
                    <div className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                      <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-dark-400 mb-4">{service.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-brand-400" />
                        <span className="text-dark-300">{service.scanTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-4 h-4 text-brand-400" />
                        <span className="text-dark-300">{service.pricing}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle - Features */}
                  <div className="lg:col-span-1">
                    <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Key Features</h4>
                    <ul className="space-y-3">
                      {service.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                          <span className="text-dark-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right - Use Cases */}
                  <div className="lg:col-span-1">
                    <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Perfect For</h4>
                    <ul className="space-y-3 mb-6">
                      {service.useCases.map((useCase, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-brand-400" />
                          <span className="text-dark-300">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/auth" className="btn-primary w-full flex items-center justify-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Service Bundles</h2>
            <p className="text-dark-400 text-lg">Save more with our comprehensive packages</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-dark-900/50 border border-white/5 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <div className="text-3xl font-bold text-brand-400 mb-4">$199<span className="text-lg text-dark-400">/mo</span></div>
              <p className="text-dark-400 mb-6">For small teams and startups</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> Web App Security
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> 5 scans/month
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> Email support
                </li>
              </ul>
              <Link to="/auth" className="btn-secondary w-full text-center block">Get Started</Link>
            </div>

            <div className="p-8 bg-gradient-to-br from-brand-600/20 to-brand-900/20 border border-brand-500/20 rounded-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-white text-xs font-semibold rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <div className="text-3xl font-bold text-brand-400 mb-4">$499<span className="text-lg text-dark-400">/mo</span></div>
              <p className="text-dark-400 mb-6">For growing security teams</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> All Starter features
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> API Security
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> Code Analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> 25 scans/month
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> Priority support
                </li>
              </ul>
              <Link to="/auth" className="btn-primary w-full text-center block">Get Started</Link>
            </div>

            <div className="p-8 bg-dark-900/50 border border-white/5 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-brand-400 mb-4">Custom</div>
              <p className="text-dark-400 mb-6">For large organizations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> All services
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> Unlimited scans
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> Dedicated support
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> Custom integrations
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-brand-400" /> SLA guarantee
                </li>
              </ul>
              <Link to="/auth" className="btn-secondary w-full text-center block">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="SentinelOps" width={24} height={24} className="rounded-lg" />
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
