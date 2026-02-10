const Scan = require('../models/Scan');
const Domain = require('../models/Domain');

/**
 * Attack Surface Management Controller
 * 
 * Aggregates real recon data from completed scans to show:
 * - Subdomains, live hosts, open ports, discovered endpoints,
 *   API endpoints, parameters, and JS files.
 */
exports.listAssets = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all completed scans with reconData
    const scans = await Scan.find({ userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .select('targets reconData scanType name createdAt')
      .limit(50);

    // Also get monitored domains
    const domains = await Domain.find({ userId }).select('domain status');

    // Aggregate attack surface data from all scans
    const subdomains = [];
    const liveHosts = [];
    const openPorts = [];
    const endpoints = [];
    const jsFiles = [];
    const directories = [];

    const seenSubs = new Set();
    const seenHosts = new Set();
    const seenPorts = new Set();
    const seenEndpoints = new Set();

    for (const scan of scans) {
      const rd = scan.reconData || {};

      // Subdomains
      for (const s of (rd.subdomains || [])) {
        const key = s.domain || s;
        if (!seenSubs.has(key)) {
          seenSubs.add(key);
          subdomains.push({
            domain: key,
            source: s.source || 'scan',
            scanId: scan._id,
            discoveredAt: scan.createdAt,
          });
        }
      }

      // Live hosts
      for (const h of (rd.liveHosts || [])) {
        const key = h.url || h.input;
        if (key && !seenHosts.has(key)) {
          seenHosts.add(key);
          liveHosts.push({
            url: key,
            statusCode: h['status-code'] || h.status_code || h.status,
            title: h.title || '',
            tech: h.tech || [],
            scanId: scan._id,
          });
        }
      }

      // Open ports
      for (const p of (rd.ports || [])) {
        const key = `${p.host}:${p.port}`;
        if (!seenPorts.has(key)) {
          seenPorts.add(key);
          openPorts.push({
            host: p.host,
            port: p.port,
            service: p.service || '',
            state: p.state || 'open',
            scanId: scan._id,
          });
        }
      }

      // Endpoints / URLs
      for (const e of (rd.endpoints || [])) {
        const key = e.url;
        if (key && !seenEndpoints.has(key)) {
          seenEndpoints.add(key);
          endpoints.push({
            url: key,
            method: e.method || 'GET',
            source: e.source || 'crawl',
            scanId: scan._id,
          });
        }
      }

      // Directories
      for (const d of (rd.directories || [])) {
        directories.push({
          url: d.url,
          status: d.status,
          scanId: scan._id,
        });
      }

      // JS files
      for (const js of (rd.jsFiles || [])) {
        jsFiles.push({ url: js, scanId: scan._id });
      }
    }

    res.json({
      summary: {
        totalSubdomains: subdomains.length,
        totalLiveHosts: liveHosts.length,
        totalOpenPorts: openPorts.length,
        totalEndpoints: endpoints.length,
        totalDirectories: directories.length,
        totalJsFiles: jsFiles.length,
        monitoredDomains: domains.length,
        lastScanDate: scans[0]?.createdAt || null,
      },
      subdomains,
      liveHosts,
      openPorts,
      endpoints,
      directories,
      jsFiles,
      monitoredDomains: domains,
    });
  } catch (err) {
    console.error('ASM error:', err);
    res.status(500).json({ message: err.message });
  }
};
