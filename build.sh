#!/bin/bash
echo "🚀 Building AI Marketing Platform..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build completed successfully!"
