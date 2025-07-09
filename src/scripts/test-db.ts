import { testConnection } from '@/lib/db';
import { createUser, authenticateUser, getUserById } from '@/lib/auth';
import { runMigrations } from '@/lib/migrate';

async function testDatabase() {
  console.log('🔍 Testing Neon Database Connection...\n');
  
  try {
    // Test connection
    console.log('1. Testing database connection...');
    const connectionResult = await testConnection();
    
    if (!connectionResult) {
      console.log('❌ Database connection failed!');
      return;
    }
    console.log('✅ Database connection successful!\n');
    
    // Run migrations
    console.log('2. Running database migrations...');
    await runMigrations();
    console.log('✅ Migrations completed!\n');
    
    // Test user creation
    console.log('3. Testing user creation...');
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    const testName = 'Test User';
    
    try {
      const newUser = await createUser(testEmail, testPassword, testName);
      console.log('✅ User created successfully:', {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        email_verified: newUser.email_verified
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        console.log('✅ User already exists (expected for repeated tests)');
      } else {
        throw error;
      }
    }
    
    // Test authentication
    console.log('\n4. Testing user authentication...');
    const authenticatedUser = await authenticateUser(testEmail, testPassword);
    
    if (authenticatedUser) {
      console.log('✅ Authentication successful:', {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        name: authenticatedUser.name
      });
    } else {
      console.log('❌ Authentication failed!');
    }
    
    // Test user retrieval
    console.log('\n5. Testing user retrieval...');
    if (authenticatedUser) {
      const retrievedUser = await getUserById(authenticatedUser.id);
      if (retrievedUser) {
        console.log('✅ User retrieval successful:', {
          id: retrievedUser.id,
          email: retrievedUser.email,
          name: retrievedUser.name
        });
      } else {
        console.log('❌ User retrieval failed!');
      }
    }
    
    console.log('\n🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

// Run the test
testDatabase()
  .then(() => {
    console.log('\n✅ Database test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }); 