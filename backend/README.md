# Webique Nexus Backend

Backend API for the Webique Nexus project management system.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webique-nexus?retryWrites=true&w=majority

# Server
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-netlify-app.netlify.app

# Optional: Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Development

```bash
npm run dev
```

### 4. Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/stats/overview` - Get finance overview

### Notes
- `GET /api/notes/important` - Get important notes
- `POST /api/notes/important` - Create important note
- `PUT /api/notes/important/:id` - Update important note
- `DELETE /api/notes/important/:id` - Delete important note

- `GET /api/notes/daily-tasks` - Get daily tasks
- `POST /api/notes/daily-tasks` - Create daily task
- `PUT /api/notes/daily-tasks/:id` - Update daily task
- `DELETE /api/notes/daily-tasks/:id` - Delete daily task

- `GET /api/notes/general` - Get general notes
- `POST /api/notes/general` - Create general note
- `PUT /api/notes/general/:id` - Update general note
- `DELETE /api/notes/general/:id` - Delete general note

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/:id` - Get single subscription
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `GET /api/subscriptions/stats/total` - Get total costs

### TikTok Ads
- `GET /api/tiktok-ads` - Get all TikTok ads
- `GET /api/tiktok-ads/:id` - Get single TikTok ad
- `POST /api/tiktok-ads` - Create TikTok ad
- `PUT /api/tiktok-ads/:id` - Update TikTok ad
- `DELETE /api/tiktok-ads/:id` - Delete TikTok ad
- `GET /api/tiktok-ads/stats/total` - Get total costs

## Deployment on Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the following:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment Variables: Add all variables from your `.env` file
4. Deploy!

## MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and update the `MONGODB_URI` in your `.env` file
