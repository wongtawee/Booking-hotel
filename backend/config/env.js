// Environment variable validation
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'PORT'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
  
  // Warnings for optional but recommended variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  Warning: STRIPE_SECRET_KEY not set. Payment features will not work.');
  }
  
  if (!process.env.FRONTEND_URL) {
    console.warn('⚠️  Warning: FRONTEND_URL not set. Using default CORS configuration.');
  }
};

module.exports = { validateEnv };
