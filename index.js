const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from React app (if built)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Marketing Platform is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    openai_configured: !!process.env.OPENAI_API_KEY,
    database_configured: !!process.env.DATABASE_URL,
    redis_configured: !!process.env.REDIS_URL
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    openai_configured: !!process.env.OPENAI_API_KEY,
    database_configured: !!process.env.DATABASE_URL,
    redis_configured: !!process.env.REDIS_URL,
    port: PORT,
    node_env: process.env.NODE_ENV
  });
});

// Simple landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Marketing Platform</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 40px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container { 
                text-align: center; 
                max-width: 600px;
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            h1 { 
                font-size: 3em; 
                margin-bottom: 20px; 
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            p { 
                font-size: 1.2em; 
                margin-bottom: 30px; 
                line-height: 1.6;
            }
            .status { 
                background: rgba(0,255,0,0.2); 
                padding: 20px; 
                border-radius: 10px; 
                margin: 20px 0;
                border: 2px solid rgba(0,255,0,0.3);
            }
            .api-links { 
                margin-top: 30px; 
            }
            .api-links a { 
                color: #fff; 
                text-decoration: none; 
                background: rgba(255,255,255,0.2); 
                padding: 10px 20px; 
                margin: 10px; 
                border-radius: 25px; 
                display: inline-block;
                transition: all 0.3s ease;
            }
            .api-links a:hover { 
                background: rgba(255,255,255,0.3); 
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 AI Marketing Platform</h1>
            <p>Your AI-powered marketing solution is now live and running!</p>
            
            <div class="status">
                <h3>✅ Status: Online</h3>
                <p>Server is running on port ${PORT}</p>
                <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
            </div>
            
            <div class="api-links">
                <a href="/api/health">Health Check</a>
                <a href="/api/test">API Test</a>
            </div>
            
            <p style="margin-top: 40px; font-size: 0.9em; opacity: 0.8;">
                Built with ❤️ using Node.js, Express, and AI
            </p>
        </div>
    </body>
    </html>
  `);
});

// Catch all handler for SPA routes
app.get('*', (req, res) => {
  // If it's an API route, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // For non-API routes, serve the main page
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Marketing Platform</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 40px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container { 
                text-align: center; 
                max-width: 600px;
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            h1 { 
                font-size: 3em; 
                margin-bottom: 20px; 
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            p { 
                font-size: 1.2em; 
                margin-bottom: 30px; 
                line-height: 1.6;
            }
            .status { 
                background: rgba(0,255,0,0.2); 
                padding: 20px; 
                border-radius: 10px; 
                margin: 20px 0;
                border: 2px solid rgba(0,255,0,0.3);
            }
            .api-links { 
                margin-top: 30px; 
            }
            .api-links a { 
                color: #fff; 
                text-decoration: none; 
                background: rgba(255,255,255,0.2); 
                padding: 10px 20px; 
                margin: 10px; 
                border-radius: 25px; 
                display: inline-block;
                transition: all 0.3s ease;
            }
            .api-links a:hover { 
                background: rgba(255,255,255,0.3); 
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 AI Marketing Platform</h1>
            <p>Your AI-powered marketing solution is now live and running!</p>
            
            <div class="status">
                <h3>✅ Status: Online</h3>
                <p>Server is running on port ${PORT}</p>
                <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
            </div>
            
            <div class="api-links">
                <a href="/api/health">Health Check</a>
                <a href="/api/test">API Test</a>
            </div>
            
            <p style="margin-top: 40px; font-size: 0.9em; opacity: 0.8;">
                Built with ❤️ using Node.js, Express, and AI
            </p>
        </div>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Marketing Platform running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI configured: ${!!process.env.OPENAI_API_KEY}`);
  console.log(`🗄️ Database configured: ${!!process.env.DATABASE_URL}`);
  console.log(`⚡ Redis configured: ${!!process.env.REDIS_URL}`);
  console.log(`🌐 Server listening on all interfaces (0.0.0.0:${PORT})`);
});
