"use server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { testNeonAuthConnection } from "@/lib/neon-auth";
import { testStackConnection } from "@/lib/stack";

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL!);

// Test Neon Auth configuration
export async function testNeonAuth() {
  return await testNeonAuthConnection();
}

// Test Stack configuration
export async function testStack() {
  return await testStackConnection();
}

// Test connection action
export async function testNeonConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    return {
      success: true,
      data: result[0],
      message: "Neon connection successful!"
    };
  } catch (error) {
    console.error("Neon connection error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed"
    };
  }
}

// Get all users action
export async function getUsers() {
  try {
    const users = await sql`
      SELECT id, email, name, email_verified, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    return {
      success: true,
      data: users,
      count: users.length
    };
  } catch (error) {
    console.error("Get users error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users"
    };
  }
}

// Get user by ID action
export async function getUserById(userId: number) {
  try {
    const users = await sql`
      SELECT id, email, name, email_verified, created_at, updated_at 
      FROM users 
      WHERE id = ${userId}
    `;
    
    if (users.length === 0) {
      return {
        success: false,
        error: "User not found"
      };
    }
    
    return {
      success: true,
      data: users[0]
    };
  } catch (error) {
    console.error("Get user error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user"
    };
  }
}

// Create tables action (for initial setup)
export async function createTables() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `;

    // Create auth_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS auth_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `;

    // Create forms table (extending for your FormGen app)
    await sql`
      CREATE TABLE IF NOT EXISTS forms (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        fields JSONB NOT NULL DEFAULT '[]',
        theme JSONB NOT NULL DEFAULT '{}',
        spreadsheet_config JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `;

    return {
      success: true,
      message: "Tables created successfully!"
    };
  } catch (error) {
    console.error("Create tables error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create tables"
    };
  }
}

// Get database stats action
export async function getDatabaseStats() {
  try {
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const sessionCount = await sql`SELECT COUNT(*) as count FROM auth_sessions`;
    
    // Check if forms table exists and get count
    let formsCount = 0;
    try {
      const formCountResult = await sql`SELECT COUNT(*) as count FROM forms`;
      formsCount = Number((formCountResult[0] as { count: string }).count);
    } catch {
      // Forms table doesn't exist yet
      formsCount = 0;
    }

    return {
      success: true,
      data: {
        users: Number((userCount[0] as { count: string }).count),
        sessions: Number((sessionCount[0] as { count: string }).count),
        forms: formsCount,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Get stats error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats"
    };
  }
}

// Clean expired sessions action
export async function cleanExpiredSessions() {
  try {
    // First count expired sessions
    const expiredCount = await sql`
      SELECT COUNT(*) as count 
      FROM auth_sessions 
      WHERE expires_at < NOW()
    `;
    
    const countToDelete = Number((expiredCount[0] as { count: string }).count);
    
    // Then delete them
    await sql`
      DELETE FROM auth_sessions 
      WHERE expires_at < NOW()
    `;
    
    revalidatePath('/dashboard');
    
    return {
      success: true,
      data: { deleted: countToDelete },
      message: `Cleaned ${countToDelete} expired sessions`
    };
  } catch (error) {
    console.error("Clean sessions error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clean sessions"
    };
  }
}

// Get recent activity action
export async function getRecentActivity() {
  try {
    const recentUsers = await sql`
      SELECT id, email, name, created_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    const activeSessions = await sql`
      SELECT COUNT(*) as count 
      FROM auth_sessions 
      WHERE expires_at > NOW()
    `;

    return {
      success: true,
      data: {
        recent_users: recentUsers,
        active_sessions: Number((activeSessions[0] as { count: string }).count)
      }
    };
  } catch (error) {
    console.error("Get activity error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch activity"
    };
  }
} 