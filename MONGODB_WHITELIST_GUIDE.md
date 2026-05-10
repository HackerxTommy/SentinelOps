# MongoDB Atlas IP Whitelist Guide

## How to Whitelist Your IP in MongoDB Atlas

### Option 1: Whitelist Your Current IP (Recommended for Development)

1. **Login to MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Login to your account

2. **Navigate to Network Access**
   - Click on your cluster (SecureVault)
   - In the left sidebar, click "Network Access"
   - Or go directly: https://cloud.mongodb.com/v2/NETWORK_ACCESS

3. **Add IP Address**
   - Click "Add IP Address" button
   - Select "Allow Access from Anywhere" to add `0.0.0.0/0` (easiest for development)
   - OR click "Add Current IP Address" to whitelist your specific IP
   - OR manually enter your IP address

4. **Confirm**
   - Click "Confirm" to save the changes
   - Wait 1-2 minutes for the changes to take effect

### Option 2: Whitelist All IPs (Easiest - Not Recommended for Production)

1. Go to Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. This adds `0.0.0.0/0` (allows all IPs)
5. Click "Confirm"

### Option 3: Whitelist Specific IP Range

1. Go to Network Access
2. Click "Add IP Address"
3. Enter IP address in CIDR format:
   - Single IP: `192.168.1.1/32`
   - Range: `192.168.1.0/24`
4. Add a description (e.g., "Home Network")
5. Click "Confirm"

### Find Your Current IP Address

**Windows:**
```powershell
# Using PowerShell
Invoke-WebRequest -Uri "https://api.ipify.org?format=json" | Select-Object -ExpandProperty Content

# Or visit: https://whatismyipaddress.com
```

**Linux/Mac:**
```bash
curl https://api.ipify.org?format=json
```

### After Whitelisting

1. Restart the server:
```bash
cd server
npm run dev
```

2. Test the health endpoint:
```bash
curl http://localhost:5000/health
```

### Troubleshooting

**If connection still fails:**
1. Check if the IP was actually added to the whitelist
2. Wait 2-3 minutes for MongoDB Atlas to propagate changes
3. Verify your IP hasn't changed (dynamic IP)
4. Check if MongoDB Atlas cluster is running
5. Verify connection string in `.env` file is correct

**Common Issues:**
- Dynamic IP: Your ISP changes your IP periodically → Use `0.0.0.0/0` for development
- VPN/Proxy: Your public IP might differ from local IP → Check with https://whatismyipaddress.com
- Corporate Network: May require specific IP ranges → Contact IT

### Security Note

**Development:** Using `0.0.0.0/0` is acceptable for testing

**Production:** Always whitelist specific IP addresses or use VPC peering for security
