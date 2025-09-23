# Webique Nexus Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Backend Deployment (Render)

1. **Push your code to GitHub** (if not already done)
2. **Go to [Render.com](https://render.com/)**
3. **Create a new Web Service**
4. **Connect your GitHub repository**
5. **Configure the service:**
   - **Name**: `webique-nexus-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18 or higher

6. **Set Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webique-nexus?retryWrites=true&w=majority
   NODE_ENV=production
   FRONTEND_URL=https://your-netlify-app.netlify.app
   PORT=3001
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

7. **Deploy!** Render will automatically build and deploy your backend.

### 2. Frontend Deployment (Netlify)

1. **Go to [Netlify.com](https://netlify.com/)**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 18 (set in netlify.toml)
4. **Set Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-render-backend-url.onrender.com`
5. **Deploy!**

**Note**: The `netlify.toml` file is already configured for optimal deployment.

### 3. MongoDB Setup

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com/)**
2. **Create a free account and cluster**
3. **Create a database user:**
   - Username: `webique-nexus`
   - Password: Generate a strong password
4. **Whitelist IP addresses:**
   - Add `0.0.0.0/0` to allow all IPs (for production)
5. **Get your connection string:**
   - Go to "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `webique-nexus`

### 4. Environment Variables Summary

#### Backend (.env in backend/ folder):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webique-nexus?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://your-netlify-app.netlify.app
PORT=3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env in root folder):
```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Cannot find module" error:**
   - Make sure you're using the correct root directory (`backend`) in Render
   - Check that all imports are using CommonJS syntax

2. **TypeScript "Cannot find type definition file for 'node'" error:**
   - Fixed by moving @types/node to dependencies (not devDependencies)
   - Added proper TypeScript configuration with "types": ["node"]
   - The build now uses `--noEmit false` flag for better compatibility

3. **CORS errors:**
   - Update `FRONTEND_URL` in your backend environment variables
   - Make sure the URL matches your Netlify domain exactly

4. **Database connection issues:**
   - Verify your MongoDB connection string
   - Check that your IP is whitelisted in MongoDB Atlas
   - Ensure the database user has proper permissions

5. **Build failures:**
   - Check the build logs in Render
   - The prebuild script ensures dependencies are installed
   - TypeScript compilation is now optimized for production

6. **Frontend build failures:**
   - Removed `lovable-tagger` dependency from vite.config.ts
   - Created netlify.toml for proper build configuration
   - Ensure VITE_API_URL environment variable is set in Netlify

## 📊 After Deployment

1. **Test your API endpoints:**
   - Visit `https://your-render-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

2. **Test your frontend:**
   - Visit your Netlify URL
   - Try creating a project, note, or subscription
   - Check that data persists (saves to MongoDB)

3. **Monitor logs:**
   - Render: Check the "Logs" tab for any errors
   - Netlify: Check the "Functions" tab for any issues

## 🎉 Success!

Once deployed, your Webique Nexus app will be fully functional with:
- ✅ Backend API running on Render
- ✅ Frontend running on Netlify  
- ✅ MongoDB database storing all data
- ✅ CORS configured for cross-origin requests
- ✅ Rate limiting and security measures in place
