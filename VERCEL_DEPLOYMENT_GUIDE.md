# SentinelOps — Step-by-Step Deployment Guide

> Deploy the **full SentinelOps repo** (client + server) on Vercel and GitHub.

---

## Option A: Full Repo on Vercel (Recommended)

> Vercel hosts the frontend static files. The backend must be hosted separately since Vercel doesn't support long-running Node servers. Use Render (free tier) for the API.

---

### Part 1: Push to GitHub

#### Step 1 — Initialize Git (if not already)

```bash
cd c:\SentinelOps
git init
git add .
git commit -m "Initial commit"
```

#### Step 2 — Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `SentinelOps`
3. Keep it **Private** or **Public** as you prefer
4. Click **"Create repository"**

#### Step 3 — Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/SentinelOps.git
git branch -M main
git push -u origin main
```

---

### Part 2: Deploy the API Server on Render

> You need the server deployed first so Vercel can point to it.

#### Step 4 — Sign Up on Render

1. Go to **[render.com](https://render.com)** → Sign up free
2. Click **"New +"** → **"Web Service"**

#### Step 5 — Connect Your GitHub Repo

1. Click **"Connect GitHub"** → Authorize Render
2. Select your **SentinelOps** repository

#### Step 6 — Fill in Service Settings

| Setting | Value |
|---------|-------|
| **Name** | `sentinelops-api` |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

#### Step 7 — Add Environment Variables

Click **"Advanced"** → add each variable:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/sentinel` |
| `SESSION_SECRET` | *(generate a random 64-character string)* |
| `GEMINI_API_KEY` | *(your Gemini API key)* |
| `OPENROUTER_API_KEY` | *(your OpenRouter key, if used)* |
| `CLIENT_URL` | `https://sentinelops.vercel.app` *(update after step 12)* |

#### Step 8 — Click "Create Web Service"

Wait 3-5 minutes. Your API will be live at:
```
https://sentinelops-api.onrender.com
```

Test it:
```bash
curl https://sentinelops-api.onrender.com/api/health
```

---

### Part 3: Deploy the Client on Vercel

#### Step 9 — Sign Up on Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**

#### Step 10 — Import Your Repo

1. Find **SentinelOps** in the list → Click **"Import"**
2. **Important:** Click **"Edit"** next to Root Directory

#### Step 11 — Configure Build

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` ← **You must change this!** |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

#### Step 12 — Add Environment Variable

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://sentinelops-api.onrender.com` |

> Use the exact URL from Step 8 (no trailing `/`)

#### Step 13 — Click "Deploy"

Wait 1-2 minutes. Your site will be live at:
```
https://sentinelops.vercel.app
```

#### Step 14 — Update Server's CLIENT_URL

Go back to **Render → sentinelops-api → Environment**:
1. Change `CLIENT_URL` to your actual Vercel URL
2. Click **"Save Changes"** → server auto-redeploys

---

### Part 4: Configure MongoDB

#### Step 15 — Whitelist All IPs

1. Go to **[cloud.mongodb.com](https://cloud.mongodb.com)** → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** → `0.0.0.0/0`
4. Click **"Confirm"**

> Wait 2 minutes for propagation.

---

### Part 5: Configure Google OAuth (if used)

#### Step 16 — Update Google Console

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** → **APIs & Services** → **Credentials**
2. Edit your OAuth 2.0 Client
3. Add **Authorized JavaScript Origins**:
   ```
   https://sentinelops.vercel.app
   ```
4. Add **Authorized Redirect URIs**:
   ```
   https://sentinelops-api.onrender.com/api/auth/google/callback
   ```
5. Click **Save**

---

### Part 6: Verify Everything Works

#### Step 17 — Test API

```bash
curl https://sentinelops-api.onrender.com/api/health
# Should return: {"status":"ok"}
```

#### Step 18 — Test Client

1. Open `https://sentinelops.vercel.app` in browser
2. ✅ Landing page loads
3. ✅ Click "Get Started" → Auth page loads
4. ✅ Register a new account
5. ✅ Dashboard loads after login
6. ✅ Open DevTools Console → no errors

---

## Automatic Deployments

Every time you push to `main`, both services auto-deploy:

```bash
git add .
git commit -m "feat: add new feature
git push origin main
# → Vercel rebuilds client
# → Render rebuilds server
```

Vercel also creates **preview deployments** for every pull request.

---

## SPA Routing

The file `client/vercel.json` handles client-side routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
This prevents 404s when users refresh on routes like `/dashboard`.

---

## Troubleshooting

### "CORS Error" in console
- Check `CLIENT_URL` on Render matches your Vercel URL exactly
- No trailing slash: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`

### "Server takes 30 seconds to respond"
- Render free tier sleeps after 15 min inactivity — first request wakes it up
- This is normal on the free plan

### "Build fails on Vercel"
- Verify Root Directory is `client` (not repo root)
- Run `npm run build` locally first to catch errors

### "Can't login after deploy"
- Verify `SESSION_SECRET` is set on Render
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### "Google OAuth doesn't work"
- Update redirect URI in Google Console to match your server URL
- Both `https://` URIs must be exact matches

---

## Architecture

```
            GitHub (main branch)
                    │
         ┌──────────┼──────────┐
         ▼                     ▼
   ┌───────────┐        ┌───────────┐
   │  Vercel   │  HTTPS │  Render   │
   │  Client   │───────▶│  Server   │
   │  (React)  │◀───────│  (Node)   │
   │  /client  │        │  /server  │
   └───────────┘        └───────────┘
                              │
                       ┌──────┴──────┐
                       │  MongoDB    │
                       │  Atlas      │
                       └─────────────┘
```

---

## Custom Domain (Optional)

| Platform | Steps |
|----------|-------|
| **Vercel** | Project Settings → Domains → Add `app.yoursite.com` → Update DNS |
| **Render** | Service Settings → Custom Domain → Add `api.yoursite.com` → Update DNS |

After adding custom domains, update:
- `CLIENT_URL` on Render → your Vercel custom domain
- `VITE_API_URL` on Vercel → your Render custom domain
