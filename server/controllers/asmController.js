const path = require('path');
const Asset = require('../models/Asset');
const { runPythonScript } = require('../services/pythonRunner');

const SCANNER_DIR = path.join(__dirname, '../../python-scanners');

const calculateRisk = (ports) => {
  const openPortsCount = ports.length;
  const hasSSH = ports.some(p => p.port === 22 || p.service === 'SSH');
  const hasMySQL = ports.some(p => p.port === 3306 || p.service === 'MySQL');

  if (openPortsCount > 5 || (hasSSH && hasMySQL)) {
    return 'Critical';
  } else if (openPortsCount >= 3 && openPortsCount <= 5) {
    return 'High';
  } else if (openPortsCount >= 1 && openPortsCount <= 2) {
    return 'Medium';
  }
  return 'Low';
};

exports.scanTargetDomain = async (req, res) => {
  try {
    const { targetDomain } = req.body;
    if (!targetDomain) return res.status(400).json({ error: 'targetDomain is required' });

    const userId = req.user.id;

    // 1. Subdomain Enum
    const subdomainResult = await runPythonScript(path.join(SCANNER_DIR, 'subdomain_enum.py'), ['--domain', targetDomain]);
    
    if (subdomainResult.error) {
      return res.status(500).json({ error: 'Subdomain enum failed: ' + subdomainResult.error });
    }

    const subdomains = subdomainResult.subdomains || [];
    const scannedAssets = [];

    for (const sub of subdomains) {
      const hostname = sub.name;
      const ip = sub.ip;
      
      // 2. Port Scan
      const portResult = await runPythonScript(path.join(SCANNER_DIR, 'port_scanner.py'), [
        '--target', ip,
        '--ports', '22,80,443,3306,5432,27017,6379,8080'
      ]);

      const openPorts = portResult.open_ports || [];
      const portsData = [];

      // 3. Service Detection
      for (const port of openPorts) {
        const serviceResult = await runPythonScript(path.join(SCANNER_DIR, 'service_detection.py'), [
          '--ip', ip,
          '--port', port.toString()
        ]);
        portsData.push({ port, service: serviceResult.service || 'unknown' });
      }

      const riskLevel = calculateRisk(portsData);
      let riskScore = 0;
      if (riskLevel === 'Critical') riskScore = 90;
      else if (riskLevel === 'High') riskScore = 70;
      else if (riskLevel === 'Medium') riskScore = 50;
      else riskScore = 10;

      // Upsert Asset
      const asset = await Asset.findOneAndUpdate(
        { hostname, userId },
        {
          assetType: 'subdomain',
          hostname,
          ip,
          ports: portsData,
          riskLevel,
          riskScore,
          lastSeen: new Date(),
          userId
        },
        { new: true, upsert: true }
      );
      scannedAssets.push(asset);
    }

    res.status(200).json({ message: 'Scan completed', assets: scannedAssets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.user.id }).sort({ lastSeen: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, userId: req.user.id });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.user.id });
    const stats = {
      total: assets.length,
      critical: assets.filter(a => a.riskLevel === 'Critical').length,
      high: assets.filter(a => a.riskLevel === 'High').length,
      medium: assets.filter(a => a.riskLevel === 'Medium').length,
      low: assets.filter(a => a.riskLevel === 'Low').length
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
