#!/bin/bash

# AI Marketing Platform - Railway Deployment Script
# This script helps you deploy your application to Railway

echo "🚀 AI Marketing Platform - Railway Deployment"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway:"
    railway login
fi

# Check if project is linked
if [ ! -f ".railway/project.json" ]; then
    echo "🔗 Linking to Railway project..."
    railway link
fi

# Add PostgreSQL database
echo "🗄️  Adding PostgreSQL database..."
railway add postgresql

# Add Redis database
echo "🔴 Adding Redis database..."
railway add redis

# Set environment variables
echo "⚙️  Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set CORS_ORIGINS=https://your-app.railway.app,http://localhost:3000
railway variables set CORS_CREDENTIALS=true
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
railway variables set BCRYPT_ROUNDS=12

echo "🔑 Please set your OpenAI API key:"
read -p "Enter your OpenAI API key: " openai_key
railway variables set OPENAI_API_KEY=$openai_key

# Deploy the application
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at: https://your-app.railway.app"
echo "📊 Monitor your deployment at: https://railway.app/dashboard"

echo ""
echo "📋 Next steps:"
echo "1. Wait for the deployment to complete"
echo "2. Set up your database by running migrations"
echo "3. Test your application"
echo "4. Configure your custom domain (optional)"

echo ""
echo "🔧 To run database migrations:"
echo "railway connect postgresql"
echo "Then run the SQL files in database/migrations/"

echo ""
echo "🎉 Your AI Marketing Platform is now live on Railway!"
