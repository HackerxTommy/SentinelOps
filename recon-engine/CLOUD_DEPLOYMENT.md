# Cloud Deployment Guide

Deploy the SecureVault Reconnaissance Engine to free cloud services.

## Available Platforms

### 1. Render.com (Recommended - Free Tier)

**Features:**
- Free SSL certificate
- Automatic HTTPS
- 512MB RAM, 0.1 CPU
- 750 hours/month free

**Steps:**

1. Push code to GitHub/GitLab
2. Go to [render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your repository
5. Select `recon-engine` directory
6. Build settings:
   - Dockerfile context: `.`
   - Dockerfile path: `Dockerfile`
7. Environment variables:
   - `PYTHONUNBUFFERED=1`
   - `SHODAN_API_KEY=your_key` (optional)
   - `VIRUSTOTAL_API_KEY=your_key` (optional)
8. Deploy

**URL:** `https://your-app-name.onrender.com`

---

### 2. Railway.app

**Features:**
- $5 free credit/month
- Automatic SSL
- 512MB RAM
- Easy GitHub integration

**Steps:**

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Select `recon-engine` directory
6. Add environment variables:
   - `PYTHONUNBUFFERED=1`
   - `SHODAN_API_KEY=your_key` (optional)
   - `VIRUSTOTAL_API_KEY=your_key` (optional)
7. Deploy

**URL:** `https://your-app-name.up.railway.app`

---

### 3. Fly.io

**Features:**
- Free tier: 3 VMs, 256MB RAM each
- Global deployment
- Automatic SSL

**Steps:**

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login:
```bash
flyctl auth login
```

3. Initialize:
```bash
cd recon-engine
flyctl launch
```

4. Deploy:
```bash
flyctl deploy
```

**URL:** `https://your-app-name.fly.dev`

---

### 4. Docker Hub + Any Cloud Provider

**Steps:**

1. Build and push to Docker Hub:
```bash
cd recon-engine
docker build -t yourusername/securevault-recon:latest .
docker push yourusername/securevault-recon:latest
```

2. Deploy to any cloud provider (AWS, GCP, Azure, DigitalOcean, etc.)

---

## Backend Configuration

After deploying the reconnaissance engine to cloud, update the backend `.env` file:

```env
RECON_CLOUD_ENDPOINT=https://your-app-name.onrender.com
```

Or update dynamically:
```javascript
dockerReconService.setEndpoint('https://your-app-name.onrender.com');
```

---

## API Endpoints

### Health Check
```
GET /health
```

### Run Reconnaissance
```
POST /api/recon
Content-Type: application/json

{
  "target": "example.com",
  "phase": "all"  // or "subdomains", "ports", "crawl", "vulns", "dirs", "cves", "exploits"
}
```

### Run Reconnaissance (GET)
```
GET /api/recon/example.com?phase=subdomains
```

---

## Testing Cloud Deployment

1. Test health endpoint:
```bash
curl https://your-app-name.onrender.com/health
```

2. Test reconnaissance:
```bash
curl -X POST https://your-app-name.onrender.com/api/recon \
  -H "Content-Type: application/json" \
  -d '{"target":"example.com","phase":"subdomains"}'
```

---

## Troubleshooting

### Build Failures
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Ensure Go tools install correctly

### Runtime Errors
- Check logs in cloud provider dashboard
- Verify environment variables
- Ensure sufficient memory (512MB minimum)

### Timeout Issues
- Increase timeout in backend service
- Use faster cloud tier
- Limit reconnaissance phases

---

## Security Notes

- All cloud platforms provide automatic SSL
- API is CORS-enabled for development
- Add authentication in production
- Use environment variables for API keys
- Monitor usage to stay within free limits
