# 🚀 Railway Deployment Guide - AI Marketing Platform

## Quick Start (5 minutes)

### Option 1: Automated Deployment (Recommended)
```bash
# Windows
deploy.bat

# Linux/Mac
./deploy.sh
```

### Option 2: Manual Deployment
Follow the step-by-step guide below.

## Prerequisites

1. **GitHub Repository**: Your code must be on GitHub
2. **Railway Account**: Sign up at [railway.app](https://railway.app) (free)
3. **OpenAI API Key**: Get one from [platform.openai.com](https://platform.openai.com)

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Make sure all files are committed
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 3. Login to Railway

```bash
railway login
```

### 4. Create New Project

```bash
# Option A: From command line
railway init

# Option B: From Railway dashboard
# Go to railway.app → New Project → Deploy from GitHub repo
```

### 5. Add Database Services

```bash
# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis
```

### 6. Set Environment Variables

```bash
# Application settings
railway variables set NODE_ENV=production
railway variables set PORT=5000

# Security
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set BCRYPT_ROUNDS=12

# CORS settings
railway variables set CORS_ORIGINS=https://your-app.railway.app,http://localhost:3000
railway variables set CORS_CREDENTIALS=true

# Rate limiting
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100

# AI Services
railway variables set OPENAI_API_KEY=your-openai-api-key-here
```

### 7. Deploy

```bash
railway up
```

### 8. Set Up Database

```bash
# Connect to PostgreSQL
railway connect postgresql

# Run migrations (copy and paste the SQL)
# From database/migrations/001_initial_schema.sql
# From database/migrations/002_add_analytics_tables.sql
```

## Configuration Files

### railway.toml
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[environments.production]
variables = { NODE_ENV = "production" }
```

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs", "python3", "pip"]

[phases.install]
cmds = [
  "npm install",
  "cd backend && npm install",
  "cd frontend && npm install",
  "cd ml-services/content_generation && pip install -r requirements.txt"
]

[phases.build]
cmds = [
  "cd frontend && npm run build",
  "cd backend && npm run build"
]

[start]
cmd = "npm run start"
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:port/db` |
| `REDIS_URL` | Redis connection | `redis://host:port` |
| `JWT_SECRET` | JWT signing key | `your-secret-key` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `CORS_ORIGINS` | Allowed origins | `https://your-app.railway.app` |

## Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app.railway.app/health
```

### 2. Test API
```bash
# Register user
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Frontend
Visit: `https://your-app.railway.app`

## Monitoring

### Railway Dashboard
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, network usage
- **Deployments**: Automatic deployments from GitHub
- **Environment**: Manage environment variables

### Health Monitoring
- Automatic health checks at `/health`
- Uptime monitoring
- Performance metrics
- Error tracking

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (18+)
   - Verify all dependencies in package.json
   - Check build logs in Railway dashboard

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check if database service is running
   - Ensure migrations have been run

3. **Frontend Not Loading**
   - Check if frontend build completed
   - Verify static file serving
   - Check browser console for errors

4. **API Errors**
   - Check backend logs
   - Verify environment variables
   - Test API endpoints individually

5. **CORS Issues**
   - Update CORS_ORIGINS with your domain
   - Check if frontend and backend are on same domain

### Getting Help

1. **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
2. **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
3. **GitHub Issues**: Create an issue in your repository

## Cost

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Web Service** | $5 credit/month | $5/month+ |
| **PostgreSQL** | Included | Included |
| **Redis** | Included | Included |
| **Total** | **$0-5/month** | **$5+/month** |

## Scaling

### Free Tier Limits
- $5 credit monthly
- 512MB RAM
- 1GB storage
- 100GB bandwidth

### Paid Plans
- **Starter**: $5/month
- **Developer**: $20/month
- **Team**: $99/month

## Custom Domain

1. Go to Railway dashboard
2. Select your service
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed
6. Update CORS_ORIGINS environment variable

## CI/CD

Railway automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway will automatically deploy
```

## Security

### Environment Variables
- Never commit API keys to git
- Use Railway's environment variables
- Rotate secrets regularly

### Database Security
- Use strong passwords
- Enable SSL connections
- Regular backups

### Application Security
- JWT token expiration
- Rate limiting
- Input validation
- CORS configuration

## Backup

### Database Backup
```bash
# Connect to database
railway connect postgresql

# Create backup
pg_dump $DATABASE_URL > backup.sql
```

### Code Backup
Your code is already backed up in GitHub.

## Maintenance

### Regular Tasks
1. Monitor logs for errors
2. Check performance metrics
3. Update dependencies
4. Rotate secrets
5. Backup database

### Updates
```bash
# Update dependencies
npm update

# Commit and push
git add .
git commit -m "Update dependencies"
git push origin main
```

## Support

- **Railway Support**: [railway.app/support](https://railway.app/support)
- **Documentation**: [docs.railway.app](https://docs.railway.app)
- **Community**: [discord.gg/railway](https://discord.gg/railway)

---

## 🎉 Congratulations!

Your AI Marketing Platform is now live on Railway! 

**Next Steps:**
1. Test all features
2. Set up monitoring
3. Configure custom domain
4. Add more users
5. Scale as needed

**Your app is available at:** `https://your-app.railway.app`
