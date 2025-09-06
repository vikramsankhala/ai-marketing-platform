# 🚀 Railway Deployment Guide - Complete Setup

## Prerequisites
1. GitHub repository with your code
2. Railway account (free at [railway.app](https://railway.app))
3. OpenAI API key

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: AI Marketing Platform"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/ai-marketing-platform.git
git push -u origin main
```

### 1.2 Verify File Structure
Make sure you have these files in your root directory:
- `railway.toml`
- `nixpacks.toml`
- `package.json` (root level)
- `requirements.txt`
- `frontend/` directory
- `backend/` directory
- `ml-services/` directory

## Step 2: Deploy to Railway

### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect it's a Node.js project

### 2.2 Add Database Services
1. In your Railway project dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database
4. Copy the `DATABASE_URL` from the database service

### 2.3 Add Redis Service
1. Click "New" again
2. Select "Database" → "Redis"
3. Railway will create a Redis instance
4. Copy the `REDIS_URL` from the Redis service

### 2.4 Configure Environment Variables
In your main service settings, add these environment variables:

```env
# Application
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Redis
REDIS_URL=redis://host:port

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Services
OPENAI_API_KEY=your-openai-api-key

# CORS
CORS_ORIGINS=https://your-app.railway.app,http://localhost:3000
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
```

### 2.5 Deploy
1. Railway will automatically start building and deploying
2. Monitor the build logs in the Railway dashboard
3. Once deployed, you'll get a URL like `https://your-app.railway.app`

## Step 3: Database Setup

### 3.1 Connect to Database
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Connect to your project
railway link

# Connect to PostgreSQL
railway connect postgresql
```

### 3.2 Run Migrations
```sql
-- Run the initial schema migration
\i database/migrations/001_initial_schema.sql

-- Run the analytics tables migration
\i database/migrations/002_add_analytics_tables.sql
```

Or use Railway's database interface:
1. Go to your PostgreSQL service in Railway
2. Click "Query"
3. Copy and paste the SQL from the migration files

## Step 4: Test Your Deployment

### 4.1 Health Check
Visit: `https://your-app.railway.app/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

### 4.2 Test API Endpoints
```bash
# Test registration
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4.3 Test Frontend
1. Visit `https://your-app.railway.app`
2. You should see the React frontend
3. Try registering a new account
4. Test the dashboard and content features

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Railway dashboard, go to your service
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 5.2 Update Environment Variables
Update `CORS_ORIGINS` to include your custom domain:
```env
CORS_ORIGINS=https://your-custom-domain.com,https://your-app.railway.app,http://localhost:3000
```

## Step 6: Monitor and Maintain

### 6.1 Railway Dashboard
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and network usage
- **Deployments**: Automatic deployments from GitHub
- **Environment**: Manage environment variables

### 6.2 Health Monitoring
Railway provides:
- Automatic health checks
- Uptime monitoring
- Performance metrics
- Error tracking

### 6.3 Scaling
- **Free Tier**: $5 credit monthly (usually enough for small apps)
- **Paid Plans**: Start at $5/month for more resources
- **Auto-scaling**: Available on paid plans

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version in `package.json`
   - Verify all dependencies are listed
   - Check build logs in Railway dashboard

2. **Database Connection Issues**
   - Verify `DATABASE_URL` format
   - Check if database service is running
   - Ensure migrations have been run

3. **Frontend Not Loading**
   - Check if frontend build completed successfully
   - Verify static file serving configuration
   - Check browser console for errors

4. **API Errors**
   - Check backend logs in Railway dashboard
   - Verify environment variables are set
   - Test API endpoints individually

5. **CORS Issues**
   - Update `CORS_ORIGINS` with your domain
   - Check if frontend and backend are on same domain

### Getting Help

1. **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
2. **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
3. **GitHub Issues**: Create an issue in your repository

## Cost Breakdown

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Web Service** | $5 credit/month | $5/month+ |
| **PostgreSQL** | Included | Included |
| **Redis** | Included | Included |
| **Total** | **$0-5/month** | **$5+/month** |

## Next Steps

1. **Set up monitoring**: Configure alerts and notifications
2. **Add CI/CD**: Automatic deployments on git push
3. **Scale up**: Upgrade to paid plan if needed
4. **Add features**: Deploy additional ML services
5. **Custom domain**: Set up your own domain name

Your AI Marketing Platform is now live on Railway! 🎉
