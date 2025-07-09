// Mock Stack configuration - will work once @stackframe/stack is installed
// Run: npm install @stackframe/stack

// Initialize Stack client for server-side operations
export const stack = {
  auth: {
    getUser: async () => {
      throw new Error('Stack package not installed. Run: npm install @stackframe/stack');
    }
  }
};

// Initialize Stack client for client-side operations
export const stackClient = {
  auth: {
    signIn: async () => {
      throw new Error('Stack package not installed. Run: npm install @stackframe/stack');
    }
  }
};

// Validate Stack configuration
export function validateStackConfig() {
  const required = [
    'NEXT_PUBLIC_STACK_PROJECT_ID',
    'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY',
    'STACK_SECRET_SERVER_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Stack environment variables: ${missing.join(', ')}`);
  }

  return true;
}

// Test Stack connection
export async function testStackConnection() {
  try {
    validateStackConfig();
    
    return {
      success: true,
      data: {
        projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
        publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ? 'Set' : 'Missing',
        secretKey: process.env.STACK_SECRET_SERVER_KEY ? 'Set' : 'Missing',
        connection: 'Package not installed',
        timestamp: new Date().toISOString()
      },
      message: 'Stack environment variables are set, but package needs to be installed'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Stack configuration failed'
    };
  }
} 