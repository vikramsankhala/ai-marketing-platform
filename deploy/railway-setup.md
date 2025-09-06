# Railway Deployment Guide

## Prerequisites
1. GitHub repository with your code
2. Railway account (free)
3. OpenAI API key

## Step 1: Prepare Your Repository

1. **Update package.json scripts** (already done):
```json
{
  "scripts": {
    "start": "cd backend && npm start",
    "build": "npm run build:frontend && npm run build:backend"
  }
}
```

2. **Set up environment variables** in Railway:
- `NODE_ENV=production`
- `DATABASE_URL` (Railway will provide PostgreSQL)
- `REDIS_URL` (Railway will provide Redis)
- `JWT_SECRET=your-super-secret-jwt-key`
- `OPENAI_API_KEY=your-openai-api-key`

## Step 2: Deploy to Railway

### Option A: Using Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add PostgreSQL database
railway add postgresql

# Add Redis
railway add redis

# Deploy
railway up
```

### Option B: Using Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add PostgreSQL and Redis services
6. Set environment variables
7. Deploy!

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your Railway backend URL
5. Deploy!

## Step 4: Deploy ML Services

For ML services, you can either:
1. Deploy as separate Railway services
2. Use Railway's multi-service setup
3. Deploy to a separate platform like Render

## Environment Variables Setup

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_WS_URL=wss://your-backend.railway.app
```

## Database Setup

1. Railway will provide a PostgreSQL database
2. Run migrations:
```bash
# Connect to Railway database
railway connect postgresql

# Run migrations
psql -h host -U user -d database -f database/migrations/001_initial_schema.sql
psql -h host -U user -d database -f database/migrations/002_add_analytics_tables.sql
```

## Monitoring

Railway provides:
- Real-time logs
- Performance metrics
- Automatic deployments
- Health checks

## Cost

- **Railway**: $5 credit monthly (usually free for small apps)
- **Vercel**: Free for personal projects
- **Total**: $0-5/month

## Troubleshooting

1. **Build fails**: Check Node.js version in package.json
2. **Database connection**: Verify DATABASE_URL format
3. **Frontend can't reach backend**: Check CORS settings and API URL
4. **ML services not working**: Verify Python dependencies and API keys
