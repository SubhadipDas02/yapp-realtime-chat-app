# Deployment Guide: Vercel + Render

## Overview
This guide will help you deploy your Chat App:
- **Frontend (React/Vite)** → Vercel
- **Backend (Node.js/Express)** → Render

---

## 1. Deploy Frontend on Vercel

### Prerequisites
- Push your code to GitHub repository
- Account on [Vercel](https://vercel.com/)

### Steps
1. **Login to Vercel** and click "New Project"
2. **Import your GitHub repository**
3. **Configure Project Settings:**
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables** (if needed):
   - Add any frontend environment variables
   - Example: `VITE_API_URL=https://your-backend-url.render.com`

5. **Deploy** - Click "Deploy" and wait for completion

### Files Added
- ✅ `Frontend/vercel.json` - Handles SPA routing for React Router

---

## 2. Deploy Backend on Render

### Prerequisites
- Account on [Render](https://render.com/)
- MongoDB Atlas database (recommended)

### Steps
1. **Login to Render** and click "New Web Service"
2. **Connect your GitHub repository**
3. **Configure Service:**
   - **Name:** `chat-app-backend` (or your preferred name)
   - **Root Directory:** `Backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Environment Variables** (copy from your .env):
   ```
   MONGODB_URI=mongodb+srv://subhadip9das:H115UgnATeJtt0eo@cluster0.9kt49gi.mongodb.net/chat-db?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=mysupersecretkey123
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=dbidbliwg
   CLOUDINARY_API_KEY=419689986934754
   CLOUDINARY_API_SECRET=19YUp-aMsiLdheU521bosrUbnFU
   ```

5. **Advanced Settings:**
   - **Health Check Path:** `/healthz`
   - **Auto-Deploy:** On (recommended)
   - **Instance Type:** Free (for testing) or paid plan

6. **Deploy** - Click "Create Web Service"

### Files Modified
- ✅ `Backend/src/index.js` - Added health check endpoint

---

## 3. Connect Frontend and Backend

### Update CORS in Backend
After deployment, update the CORS origin in `Backend/src/index.js`:

```javascript
app.use(cors({
    origin: ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
    credentials: true,
}))
```

### Update API URL in Frontend
Update your frontend API base URL to point to your Render backend:

```javascript
// In Frontend/src/lib/axios.js or similar
const API_BASE_URL = "https://your-render-app.onrender.com"
```

---

## 4. Environment Variables Reference

### Backend (Render)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend (Vercel) - Optional
```env
VITE_API_URL=https://your-render-app.onrender.com
```

---

## 5. Post-Deployment Checklist

- [ ] Backend deploys successfully on Render
- [ ] Frontend deploys successfully on Vercel
- [ ] Health check endpoint responds at `/healthz`
- [ ] CORS allows your Vercel domain
- [ ] API calls work from frontend to backend
- [ ] Socket.io connections work
- [ ] File uploads work (Cloudinary)
- [ ] Authentication flows work
- [ ] Database connections are stable

---

## 6. Troubleshooting

### Common Issues

**404 on Vercel:**
- Ensure `vercel.json` exists with SPA rewrites
- Check if Root Directory is set to `Frontend`
- Verify Output Directory is `dist`

**Backend not starting on Render:**
- Check environment variables are set
- Verify Start Command is `npm start`
- Check logs for missing dependencies

**CORS errors:**
- Update CORS origin to include your Vercel URL
- Ensure credentials: true is set

**Socket.io not connecting:**
- Update frontend socket connection URL
- Check if WebSocket connections are allowed

---

## 7. URLs After Deployment

- **Frontend:** `https://your-app-name.vercel.app`
- **Backend:** `https://your-service-name.onrender.com`
- **Health Check:** `https://your-service-name.onrender.com/healthz`

---

## Need Help?

- Check deployment logs on both platforms
- Test API endpoints with Postman
- Monitor database connections
- Review environment variable settings

**Happy Deploying! 🚀**