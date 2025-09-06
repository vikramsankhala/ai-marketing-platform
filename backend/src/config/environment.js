require('dotenv').config();

const config = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  HOST: process.env.HOST || 'localhost',
  DEBUG: process.env.DEBUG === 'true',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://admin:password123@localhost:5432/ai_marketing',
  POSTGRES_DB: process.env.POSTGRES_DB || 'ai_marketing',
  POSTGRES_USER: process.env.POSTGRES_USER || 'admin',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'password123',
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT, 10) || 5432,

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',

  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  COHERE_API_KEY: process.env.COHERE_API_KEY,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,

  // Social Media APIs
  TWITTER_API_KEY: process.env.TWITTER_API_KEY,
  TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,

  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  FACEBOOK_ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN,

  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,

  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,

  // Ad Platform APIs
  GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  GOOGLE_ADS_CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET,
  GOOGLE_ADS_REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN,

  FACEBOOK_ADS_ACCESS_TOKEN: process.env.FACEBOOK_ADS_ACCESS_TOKEN,
  FACEBOOK_ADS_APP_ID: process.env.FACEBOOK_ADS_APP_ID,
  FACEBOOK_ADS_APP_SECRET: process.env.FACEBOOK_ADS_APP_SECRET,

  AMAZON_ADS_CLIENT_ID: process.env.AMAZON_ADS_CLIENT_ID,
  AMAZON_ADS_CLIENT_SECRET: process.env.AMAZON_ADS_CLIENT_SECRET,
  AMAZON_ADS_REFRESH_TOKEN: process.env.AMAZON_ADS_REFRESH_TOKEN,

  // CRM Integration
  SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
  SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
  SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME,
  SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD,
  SALESFORCE_SECURITY_TOKEN: process.env.SALESFORCE_SECURITY_TOKEN,

  HUBSPOT_API_KEY: process.env.HUBSPOT_API_KEY,
  PIPEDRIVE_API_KEY: process.env.PIPEDRIVE_API_KEY,

  // Analytics Platforms
  GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
  GOOGLE_ANALYTICS_CREDENTIALS_PATH: process.env.GOOGLE_ANALYTICS_CREDENTIALS_PATH,

  MIXPANEL_PROJECT_TOKEN: process.env.MIXPANEL_PROJECT_TOKEN,
  MIXPANEL_API_SECRET: process.env.MIXPANEL_API_SECRET,

  AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
  AMPLITUDE_SECRET_KEY: process.env.AMPLITUDE_SECRET_KEY,

  // Email Services
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,

  // Cloud Storage
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_CREDENTIALS_PATH: process.env.GOOGLE_CLOUD_CREDENTIALS_PATH,

  AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY,

  // Message Queue
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'localhost:9092',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'ai-marketing-platform',
  KAFKA_AUTO_OFFSET_RESET: process.env.KAFKA_AUTO_OFFSET_RESET || 'earliest',

  // WebSocket
  WS_PORT: parseInt(process.env.WS_PORT, 10) || 5000,
  WS_HOST: process.env.WS_HOST || 'localhost',

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain'
  ],

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

  // Caching
  CACHE_TTL: parseInt(process.env.CACHE_TTL, 10) || 3600, // 1 hour
  CACHE_MAX_SIZE: parseInt(process.env.CACHE_MAX_SIZE, 10) || 1000,

  // Monitoring
  PROMETHEUS_PORT: parseInt(process.env.PROMETHEUS_PORT, 10) || 9090,
  GRAFANA_PORT: parseInt(process.env.GRAFANA_PORT, 10) || 3001,
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  KIBANA_URL: process.env.KIBANA_URL || 'http://localhost:5601',

  // Security
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,

  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key',
  ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',

  // External Services
  ZAPIER_WEBHOOK_URL: process.env.ZAPIER_WEBHOOK_URL,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,

  // Development
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true',
  ENABLE_GRAPHIQL: process.env.ENABLE_GRAPHIQL === 'true'
};

// Validate required environment variables
const requiredVars = [
  'JWT_SECRET',
  'DATABASE_URL'
];

const missingVars = requiredVars.filter(varName => !config[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

// Validate JWT secret strength in production
if (config.NODE_ENV === 'production' && config.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long in production');
  process.exit(1);
}

module.exports = config;
