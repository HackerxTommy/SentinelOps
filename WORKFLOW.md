# SecureVault - Full API Workflow & Endpoints

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│  MongoDB Atlas  │
│  (React/Vite)   │     │   (Express.js)  │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │ In-Memory Queue │
                        │  (Scan Worker)  │
                        └─────────────────┘
```

## Complete API Endpoints

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

**Register Request:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### 2. Scans (`/api/scans`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/scans` | Create new scan | Yes |
| GET | `/api/scans` | List all user scans | Yes |
| GET | `/api/scans/:scanId` | Get scan details | Yes |
| PATCH | `/api/scans/:scanId/cancel` | Cancel running scan | Yes |
| GET | `/api/scans/:scanId/findings` | Get scan findings | Yes |

**Create Scan Request:**
```json
POST /api/scans
{
  "targetUrl": "https://example.com",
  "targetType": "web",        // web | api | repo
  "scanMode": "standard"      // quick | standard | deep
}
```

**Scan Response:**
```json
{
  "success": true,
  "scan": {
    "_id": "...",
    "targetUrl": "https://example.com",
    "targetType": "web",
    "scanMode": "standard",
    "status": "pending",      // pending | running | completed | failed
    "progress": 0,
    "phases": [],
    "statistics": {
      "totalFindings": 0,
      "criticalCount": 0,
      "highCount": 0,
      "mediumCount": 0,
      "lowCount": 0
    },
    "createdAt": "2026-04-19T..."
  }
}
```

---

### 3. Reconnaissance (`/api/recon`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/recon/run` | Run full recon on target | Yes |
| GET | `/api/recon/subdomains/:domain` | Enumerate subdomains | Yes |
| GET | `/api/recon/technologies/:url` | Detect technologies | Yes |

**Subdomain Enumeration Response:**
```json
{
  "success": true,
  "domain": "example.com",
  "subdomains": [
    {
      "subdomain": "www.example.com",
      "statusCode": 200,
      "discoveredAt": "2026-04-19T..."
    }
  ],
  "count": 1
}
```

**Technology Detection Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "technologies": [
    {
      "name": "cloudflare",
      "type": "web_server",
      "confidence": "high",
      "evidence": "Server header: cloudflare"
    }
  ],
  "count": 1
}
```

---

### 4. Code Analysis (`/api/code-analysis`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/code-analysis/analyze` | Analyze GitHub repository | Yes |
| GET | `/api/code-analysis/quality/:repoUrl` | Get code quality metrics | Yes |
| GET | `/api/code-analysis/dependencies/:repoUrl` | Scan dependencies | Yes |

**Analyze Repository Request:**
```json
POST /api/code-analysis/analyze
{
  "repoUrl": "https://github.com/owner/repo"
}
```

**Analysis Response:**
```json
{
  "success": true,
  "results": {
    "repository": {
      "name": "repo",
      "url": "https://github.com/owner/repo",
      "language": "JavaScript",
      "stars": 1000
    },
    "findings": [
      {
        "severity": "critical",
        "type": "hardcoded_api_key",
        "title": "Potential API_KEY in Code",
        "cwe": "CWE-798"
      }
    ],
    "summary": {
      "totalFindings": 5,
      "critical": 1,
      "high": 2
    }
  }
}
```

---

### 5. Reports (`/api/reports`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reports/generate` | Generate report (json/html/csv) | Yes |
| GET | `/api/reports` | List all reports | Yes |
| GET | `/api/reports/:reportId` | Get specific report | Yes |

**Generate Report Request:**
```json
POST /api/reports/generate
{
  "scanId": "...",
  "format": "json"    // json | html | csv
}
```

---

### 6. Analytics (`/api/analytics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/dashboard` | Get dashboard analytics | Yes |

**Dashboard Analytics Response:**
```json
{
  "success": true,
  "analytics": {
    "summary": {
      "totalScans": 10,
      "completedScans": 8,
      "failedScans": 0,
      "totalFindings": 25,
      "criticalIssues": 2,
      "highIssues": 5,
      "avgScanDuration": 120
    },
    "severity": {
      "critical": 2,
      "high": 5,
      "medium": 8,
      "low": 7,
      "info": 3
    },
    "byTargetType": {
      "web": 6,
      "api": 2,
      "repo": 2
    },
    "riskTrend": {
      "trend": "stable",    // stable | increasing | decreasing
      "direction": "none",
      "percentage": 0
    },
    "topVulnerabilityTypes": [
      { "type": "xss", "count": 5 },
      { "type": "sql_injection", "count": 3 }
    ],
    "scans": [...]
  }
}
```

---

### 7. Webhooks (`/api/webhooks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/webhooks/github` | GitHub webhook handler | No |

**GitHub Webhook Payload:**
```json
{
  "action": "opened",
  "pull_request": {
    "number": 1,
    "head": { "ref": "feature/test" },
    "user": { "login": "testuser" }
  },
  "repository": {
    "name": "test-repo",
    "html_url": "https://github.com/test/test-repo",
    "owner": { "login": "test" }
  }
}
```

---

## Scan Lifecycle Workflow

```
1. Create Scan
   POST /api/scans
   → Status: pending

2. Worker Processes
   → Phase 1: Reconnaissance (15%)
      - Subdomain enumeration
      - Technology detection
      - Port scanning
      - Security headers check
      - Secret detection
   
   → Phase 2: Code Analysis (for repo targets)
      - GitHub repo scan
      - Secret detection in code
      - Dependency vulnerability scan
   
   → Phase 3: Vulnerability Scanning (40%)
   
   → Phase 4: Exploitation Check (70%)
   
   → Phase 5: Report Generation (90%)

3. Scan Complete (100%)
   → Status: completed
   → Findings saved to database
   → Statistics calculated

4. View Findings
   GET /api/scans/:scanId/findings

5. Generate Report
   POST /api/reports/generate
```

---

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/securevault
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
GITHUB_TOKEN=ghp_...
GITHUB_WEBHOOK_SECRET=your-webhook-secret
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Queue | In-Memory (Bull replacement) |
| Auth | JWT |
| HTTP | Axios |

---

## Security Features

1. **Authentication**: JWT-based with bcrypt password hashing
2. **Authorization**: Middleware-protected routes
3. **Input Validation**: Joi validation on scan creation
4. **Security Headers**: Helmet.js
5. **CORS**: Configured for frontend origin
6. **Rate Limiting**: Can be added per endpoint

---

## Deployment Ready

✅ No Redis required (in-memory queue)
✅ MongoDB Atlas compatible
✅ Environment-based configuration
✅ Docker-ready (can containerize)
✅ CI/CD webhook integration
