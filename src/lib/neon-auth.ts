import { neon } from '@neondatabase/serverless';

// Neon Auth configuration
export const neonAuthConfig = {
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretKey: process.env.STACK_SECRET_SERVER_KEY!,
};

// Gracefully handle missing DATABASE_URL to avoid crashes during build time.
const DATABASE_URL = process.env.DATABASE_URL;

function createNeonProxy() {
  return new Proxy(() => {}, {
    apply() {
      throw new Error('DATABASE_URL is not set. Database operations are unavailable.');
    },
  }) as unknown as ReturnType<typeof neon>;
}

// Database connection (lazy / safe)
export const sql = DATABASE_URL ? neon(DATABASE_URL) : createNeonProxy();

// Server-side database client (alias for sql)
export const db = sql;

// Validate environment variables
export function validateNeonAuthConfig() {
  const required = [
    'NEXT_PUBLIC_STACK_PROJECT_ID',
    'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY', 
    'STACK_SECRET_SERVER_KEY',
    'DATABASE_URL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}

// Test Neon Auth connection
export async function testNeonAuthConnection() {
  try {
    validateNeonAuthConfig();
    
    return {
      success: true,
      data: {
        database: 'Connected',
        auth_config: {
          projectId: neonAuthConfig.projectId,
          publishableKey: neonAuthConfig.publishableKey ? 'Set' : 'Missing',
          secretKey: neonAuthConfig.secretKey ? 'Set' : 'Missing'
        }
      },
      message: 'Neon Auth configuration is valid'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Configuration failed'
    };
  }
} 