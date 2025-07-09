import { neon } from '@neondatabase/serverless';

// Neon Auth configuration
export const neonAuthConfig = {
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretKey: process.env.STACK_SECRET_SERVER_KEY!,
};

// Database connection
export const sql = neon(process.env.DATABASE_URL!);

// Server-side database client (using neon directly)
export const db = neon(process.env.DATABASE_URL!);

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
    
    // Test database connection
    const dbResult = await sql`SELECT NOW() as current_time`;
    
    return {
      success: true,
      data: {
        database: 'Connected',
        auth_config: {
          projectId: neonAuthConfig.projectId,
          publishableKey: neonAuthConfig.publishableKey ? 'Set' : 'Missing',
          secretKey: neonAuthConfig.secretKey ? 'Set' : 'Missing'
        },
        timestamp: dbResult[0].current_time
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