# 🚀 Deployment Guide - Vaidya Healthcare Platform

## 📋 Prerequisites
- MongoDB Atlas account (for database)
- Render account (for hosting)
- Git repository (already set up)

## 🔧 Deploy to Render

### **Option 1: Using render.yaml (Recommended)**

1. **Push your code to GitHub** (Already done ✅)
   ```bash
   git push origin main
   ```

2. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `srikiran1905s/FEDF`
   - Configure:
     - **Name:** `vaidya-backend`
     - **Region:** Choose closest to you
     - **Branch:** `main`
     - **Root Directory:** `backend`
     - **Runtime:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

4. **Set Environment Variables**
   In Render dashboard, add these environment variables:
   
   ```
   MONGODB_URI=mongodb+srv://2410030463:srikiran@cluster0.2cxzghy.mongodb.net/vaidya?retryWrites=true&w=majority
   JWT_SECRET=vaidya_secret_key_change_in_production_2025
   PORT=5000
   NODE_ENV=production
   ```

5. **Deploy Frontend (Static Site)**
   - Click "New +" → "Static Site"
   - Connect same repository
   - Configure:
     - **Name:** `vaidya-frontend`
     - **Root Directory:** `html-frontend`
     - **Build Command:** (leave empty)
     - **Publish Directory:** `.`

6. **Update Frontend API URL**
   After backend deploys, update `html-frontend/api.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
   ```

---

### **Option 2: Manual Deployment**

#### **Deploy Backend:**

```bash
# In Render Dashboard
Service Type: Web Service
Repository: srikiran1905s/FEDF
Root Directory: backend
Build Command: npm install
Start Command: npm start

Environment Variables:
- MONGODB_URI=<your-mongodb-connection-string>
- JWT_SECRET=<random-secure-string>
- PORT=5000
- NODE_ENV=production
```

#### **Deploy Frontend:**

```bash
# In Render Dashboard
Service Type: Static Site
Repository: srikiran1905s/FEDF
Root Directory: html-frontend
Build Command: (empty)
Publish Directory: .
```

---

## 🔐 MongoDB Setup

1. **Create MongoDB Atlas Cluster**
   - Go to: https://cloud.mongodb.com/
   - Create a free cluster
   - Create database user
   - Whitelist all IPs (0.0.0.0/0) for Render access
   - Get connection string

2. **Update Connection String**
   Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`

---

## 📝 Post-Deployment Steps

1. **Seed Database**
   ```bash
   # Run this once after deployment
   npm run seed
   ```
   Or manually via Render shell.

2. **Update CORS Settings**
   In `backend/server.js`, update:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-url.onrender.com',
     credentials: true
   }));
   ```

3. **Test Deployment**
   - Visit your frontend URL
   - Try signing in with test credentials:
     - Doctor: `sarah.johnson@hospital.com` / `password123`
     - Patient: `john@example.com` / `password123`

---

## 🌐 URLs After Deployment

- **Backend API:** `https://vaidya-backend.onrender.com`
- **Frontend:** `https://vaidya-frontend.onrender.com`
- **Health Check:** `https://vaidya-backend.onrender.com/api/health`

---

## 🐛 Troubleshooting

### Error: Cannot find package.json
**Solution:** Make sure Root Directory is set to `backend` in Render settings

### Error: MongoDB connection failed
**Solution:** Check MONGODB_URI environment variable and IP whitelist in Atlas

### Error: CORS issues
**Solution:** Update CORS origin in `backend/server.js` to match frontend URL

### Error: 404 on routes
**Solution:** Add rewrite rules in Render static site settings for SPA routing

---

## 🔄 Updating Deployment

```bash
# Make changes
git add .
git commit -m "Update"
git push origin main

# Render will auto-deploy on push
```

---

## 📊 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `random-secure-string` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Render account created
- [ ] Backend service deployed
- [ ] Environment variables configured
- [ ] Frontend static site deployed
- [ ] API URL updated in frontend
- [ ] CORS settings updated
- [ ] Database seeded
- [ ] Test login works

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
- **Support:** Check Render community or MongoDB forums
