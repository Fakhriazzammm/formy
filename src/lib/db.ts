import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

// Gracefully handle missing DATABASE_URL at import / build time.
// We only establish a real connection if the environment variable is present.
const DATABASE_URL = process.env.DATABASE_URL;

let connection: ReturnType<typeof neon> | null = null;
let db: ReturnType<typeof drizzle>;

if (DATABASE_URL) {
  // Establish real connection
  try {
    connection = neon(DATABASE_URL);
    db = drizzle(connection);
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    // Fallback to proxy that throws informative error on any method usage
    db = new Proxy({}, {
      get() {
        throw new Error('Database initialization failed. Please check your DATABASE_URL.');
      },
    }) as unknown as ReturnType<typeof drizzle>;
  }
} else {
  // No DATABASE_URL provided – create proxy that throws on access, but do NOT throw during import.
  console.warn('Warning: DATABASE_URL is not set. Database operations will fail until it is provided.');
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  db = new Proxy({}, {
    get() {
      throw new Error('DATABASE_URL is not set. Please set it in your environment before performing database operations.');
    },
  }) as unknown as ReturnType<typeof drizzle>;
}

// Export the (possibly proxy) database instance so other modules can import safely.
export { db };

// Enhanced test connection function
export async function testConnection() {
  try {
    const startTime = Date.now();
    const result = await db.execute(sql`SELECT 1 as test, NOW() as timestamp, version() as db_version`);
    // `db.execute` returns an object with a `rows` property (NeonHttpQueryResult)
    const rows = (result as { rows: Array<Record<string, unknown>> }).rows;
    const endTime = Date.now();
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
export async function executeQuery(query: string) {
  if (!query || query.trim().length === 0) {
    throw new Error('Query cannot be empty');
  }
  
  try {
    const startTime = Date.now();
    // Drizzle's `sql.raw()` accepts a single SQL string; params should be interpolated beforehand
    const result = await db.execute(sql.raw(query));
    const endTime = Date.now();
    
    console.log(`✅ Query executed successfully in ${endTime - startTime}ms`);
    // Support both array and NeonHttpQueryResult shapes
    const rows = (Array.isArray(result)
      ? result
      : (result as { rows: Array<Record<string, unknown>> }).rows);

    return {
      success: true,
      data: rows,
      executionTime: `${endTime - startTime}ms`,
      rowCount: rows.length
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
    
    const rows = (healthCheck as { rows: Array<Record<string, unknown>> }).rows;

    return {
      success: true,
      data: rows[0],
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