import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

// Validate environment variables
function validateDatabaseConfig() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please check your .env.local file.');
  }
  
  // Validate DATABASE_URL format
  if (!process.env.DATABASE_URL.includes('neon.tech')) {
    console.warn('Warning: DATABASE_URL does not appear to be a Neon database URL');
  }
}

// Initialize database configuration
validateDatabaseConfig();

// Create Neon connection with error handling
let connection: ReturnType<typeof neon>;
let db: ReturnType<typeof drizzle>;

try {
  connection = neon(process.env.DATABASE_URL!);
  db = drizzle(connection);
} catch (error) {
  console.error('Failed to initialize database connection:', error);
  throw new Error('Database initialization failed. Please check your DATABASE_URL.');
}

// Export the database instance
export { db };

// Enhanced test connection function
export async function testConnection() {
  try {
    const startTime = Date.now();
    const result = await db.execute(sql`SELECT 1 as test, NOW() as timestamp, version() as db_version`);
    const endTime = Date.now();
    const rows = result as Array<Record<string, unknown>>;
    const connectionInfo = {
      success: true,
      responseTime: `${endTime - startTime}ms`,
      timestamp: rows[0]?.timestamp,
      version: rows[0]?.db_version,
      test: rows[0]?.test
    };
    
    console.log('✅ Database connection successful:', connectionInfo);
    return connectionInfo;
  } catch (error) {
    const errorInfo = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString()
    };
    
    console.error('❌ Database connection failed:', errorInfo);
    return errorInfo;
  }
}

// Enhanced helper function to execute raw SQL with better error handling
export async function executeQuery(query: string, params?: unknown[]) {
  if (!query || query.trim().length === 0) {
    throw new Error('Query cannot be empty');
  }
  
  try {
    const startTime = Date.now();
    const result = await db.execute(sql.raw(query, params));
    const endTime = Date.now();
    
    console.log(`✅ Query executed successfully in ${endTime - startTime}ms`);
    return {
      success: true,
      data: result,
      executionTime: `${endTime - startTime}ms`,
      rowCount: Array.isArray(result) ? result.length : 0
    };
  } catch (error) {
    const errorInfo = {
      success: false,
      error: error instanceof Error ? error.message : 'Query execution failed',
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString()
    };
    
    console.error('❌ Query execution failed:', errorInfo);
    throw new Error(`Database query failed: ${errorInfo.error}`);
  }
}

// Database health check function
export async function checkDatabaseHealth() {
  try {
    const healthCheck = await db.execute(sql`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version,
        NOW() as current_timestamp,
        (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count
    `);
    
    return {
      success: true,
      data: healthCheck[0],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Health check failed',
      timestamp: new Date().toISOString()
    };
  }
}

// Connection pool status (for monitoring)
export function getConnectionStatus() {
  return {
    initialized: !!db,
    hasConnection: !!connection,
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    timestamp: new Date().toISOString()
  };
}

// Graceful shutdown function (for cleanup)
export async function closeConnection() {
  try {
    // Note: Neon serverless connections are automatically managed
    // This is mainly for cleanup and logging
    console.log('🔄 Database connection cleanup completed');
    return { success: true };
  } catch (error) {
    console.error('❌ Database connection cleanup failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Cleanup failed' 
    };
  }
} 