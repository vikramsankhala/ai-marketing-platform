const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
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
            h1 { font-size: 3em; margin-bottom: 20px; }
            p { font-size: 1.2em; margin-bottom: 30px; }
            .status { 
                background: rgba(0,255,0,0.2); 
                padding: 20px; 
                border-radius: 10px; 
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 AI Marketing Platform</h1>
            <p>Your AI-powered marketing solution is now live!</p>
            <div class="status">
                <h3>✅ Status: Online</h3>
                <p>Server running on port ${PORT}</p>
                <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
                <p>OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Not configured'}</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Marketing Platform is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
