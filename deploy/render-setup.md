# Render Deployment Guide

## Prerequisites
1. GitHub repository with your code
2. Render account (free)
3. OpenAI API key

## Step 1: Deploy Backend API

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ai-marketing-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `JWT_SECRET=your-super-secret-jwt-key`
   - `OPENAI_API_KEY=your-openai-api-key`

## Step 2: Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `ai-marketing-db`
   - **Plan**: Free
   - **Database**: `ai_marketing`
   - **User**: `ai_marketing_user`

3. Copy the connection string to your backend environment variables as `DATABASE_URL`

## Step 3: Create Redis Database

1. Click "New +" → "Redis"
2. Configure:
   - **Name**: `ai-marketing-redis`
   - **Plan**: Free

3. Copy the connection string to your backend environment variables as `REDIS_URL`

## Step 4: Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ai-marketing-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free

4. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://ai-marketing-backend.onrender.com`)

## Step 5: Deploy ML Services

### Content Generation Service
1. Click "New +" → "Web Service"
2. Configure:
   - **Name**: `ai-marketing-content-gen`
   - **Environment**: `Python`
   - **Build Command**: `cd ml-services/content_generation && pip install -r requirements.txt`
   - **Start Command**: `cd ml-services/content_generation && python app.py`
   - **Plan**: Free

3. Add environment variables:
   - `FLASK_ENV=production`
   - `PORT=10001`
   - `OPENAI_API_KEY=your-openai-api-key`

## Step 6: Database Setup

1. Connect to your PostgreSQL database
2. Run the migration scripts:
```sql
-- Run 001_initial_schema.sql
-- Run 002_add_analytics_tables.sql
```

## Step 7: Configure CORS

Update your backend CORS settings to include your frontend URL:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-marketing-frontend.onrender.com'
  ],
  credentials: true
}));
```

## Environment Variables Summary

### Backend
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
```

### Frontend
```env
REACT_APP_API_URL=https://ai-marketing-backend.onrender.com
REACT_APP_WS_URL=wss://ai-marketing-backend.onrender.com
```

### ML Services
```env
FLASK_ENV=production
PORT=10001
OPENAI_API_KEY=your-openai-api-key
```

## Cost

- **Render Free Tier**: 750 hours/month per service
- **PostgreSQL**: Free (1GB storage)
- **Redis**: Free (25MB storage)
- **Total**: $0/month (within free limits)

## Monitoring

Render provides:
- Real-time logs
- Performance metrics
- Automatic deployments
- Health checks
- Custom domains

## Troubleshooting

1. **Build timeout**: Increase build timeout in settings
2. **Memory issues**: Upgrade to paid plan if needed
3. **Database connection**: Check connection string format
4. **CORS errors**: Verify frontend URL in CORS settings
5. **ML service issues**: Check Python dependencies and API keys

## Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate will be automatically provisioned
