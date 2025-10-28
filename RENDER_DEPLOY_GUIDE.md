# 🚀 Render Deployment Guide

## Quick Deploy Instructions

### Step 1: Go to Render Dashboard
Visit: https://dashboard.render.com/

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `srikiran1905s/FEDF`
3. Click **"Connect"**

### Step 3: Configure Service

Use these **EXACT** settings:

```
Name: vaidya-backend
Region: (Choose your preferred region)
Branch: main
Root Directory: (leave empty)
Runtime: Node
Build Command: npm run build
Start Command: npm start
```

### Step 4: Add Environment Variables

Click **"Advanced"** and add these environment variables:

```
MONGODB_URI=mongodb+srv://2410030463:srikiran@cluster0.2cxzghy.mongodb.net/vaidya?retryWrites=true&w=majority
JWT_SECRET=vaidya_secret_key_change_in_production_2025
PORT=5000
NODE_ENV=production
```

### Step 5: Deploy

Click **"Create Web Service"** and wait for deployment to complete.

---

## What Happens During Build:

1. Render runs: `npm run build`
   - This installs dependencies in the `backend` folder
2. Render runs: `npm start`
   - This starts the server with `node backend/server.js`

---

## After Deployment:

Your backend will be available at:
```
https://vaidya-backend.onrender.com
```

Test the health endpoint:
```
https://vaidya-backend.onrender.com/api/health
```

---

## Update Frontend API URL

After backend deploys, update `html-frontend/api.js`:

```javascript
const API_BASE_URL = 'https://vaidya-backend.onrender.com/api';
```

Then commit and push:
```bash
git add .
git commit -m UpdateAPIURL
git push origin main
```

---

## Deploy Frontend (Optional)

1. Click **"New +"** → **"Static Site"**
2. Connect same repository
3. Configure:
   ```
   Name: vaidya-frontend
   Branch: main
   Root Directory: html-frontend
   Build Command: (leave empty)
   Publish Directory: .
   ```
4. Click **"Create Static Site"**

---

## Troubleshooting

### Error: Cannot find module
**Solution:** Make sure Build Command is `npm run build` (NOT `cd backend && npm install`)

### Error: MONGODB connection failed
**Solution:** Check MONGODB_URI in environment variables

### Backend URL not working
**Solution:** Wait 2-3 minutes after deployment, free tier takes time to spin up

---

## Commands Summary

| Setting | Value |
|---------|-------|
| Root Directory | (empty) |
| Build Command | `npm run build` |
| Start Command | `npm start` |

---

✅ Follow these exact steps and your deployment should succeed!
