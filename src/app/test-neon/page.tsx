'use client';

import { useState } from 'react';
import { 
  testNeonConnection, 
  getUsers, 
  createTables, 
  getDatabaseStats,
  getRecentActivity,
  cleanExpiredSessions,
  testNeonAuth
} from '@/app/actions';

interface ConnectionResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  count?: number;
}

export default function TestNeonPage() {
  const [connectionResult, setConnectionResult] = useState<ConnectionResult | null>(null);
  const [users, setUsers] = useState<ConnectionResult | null>(null);
  const [stats, setStats] = useState<ConnectionResult | null>(null);
  const [activity, setActivity] = useState<ConnectionResult | null>(null);
  const [authResult, setAuthResult] = useState<ConnectionResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setLoading('connection');
    try {
      const result = await testNeonConnection();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCreateTables = async () => {
    setLoading('tables');
    try {
      const result = await createTables();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleGetUsers = async () => {
    setLoading('users');
    try {
      const result = await getUsers();
      setUsers(result);
    } catch (error) {
      setUsers({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleGetStats = async () => {
    setLoading('stats');
    try {
      const result = await getDatabaseStats();
      setStats(result);
    } catch (error) {
      setStats({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleGetActivity = async () => {
    setLoading('activity');
    try {
      const result = await getRecentActivity();
      setActivity(result);
    } catch (error) {
      setActivity({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCleanSessions = async () => {
    setLoading('clean');
    try {
      const result = await cleanExpiredSessions();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleTestNeonAuth = async () => {
    setLoading('auth');
    try {
      const result = await testNeonAuth();
      setAuthResult(result);
    } catch (error) {
      setAuthResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🚀 Test Neon Database Connection
          </h1>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={handleTestConnection}
              disabled={loading === 'connection'}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading === 'connection' ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button
              onClick={handleCreateTables}
              disabled={loading === 'tables'}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading === 'tables' ? 'Creating...' : 'Create Tables'}
            </button>
            
            <button
              onClick={handleGetUsers}
              disabled={loading === 'users'}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading === 'users' ? 'Loading...' : 'Get Users'}
            </button>
            
            <button
              onClick={handleGetStats}
              disabled={loading === 'stats'}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading === 'stats' ? 'Loading...' : 'Database Stats'}
            </button>
            
            <button
              onClick={handleGetActivity}
              disabled={loading === 'activity'}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading === 'activity' ? 'Loading...' : 'Recent Activity'}
            </button>
            
            <button
              onClick={handleCleanSessions}
              disabled={loading === 'clean'}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading === 'clean' ? 'Cleaning...' : 'Clean Sessions'}
            </button>
            
            <button
              onClick={handleTestNeonAuth}
              disabled={loading === 'auth'}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading === 'auth' ? 'Testing...' : 'Test Neon Auth'}
            </button>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            {/* Connection Result */}
            {connectionResult && (
              <div className={`p-4 rounded-lg ${
                connectionResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  connectionResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  Connection Test Result
                </h3>
                {connectionResult.success ? (
                  <div className="text-green-700">
                    <p>{connectionResult.message}</p>
                    {connectionResult.data && (
                      <pre className="mt-2 text-sm bg-green-100 p-2 rounded">
                        {JSON.stringify(connectionResult.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ) : (
                  <p className="text-red-700">{connectionResult.error}</p>
                )}
              </div>
            )}

            {/* Users Result */}
            {users && (
              <div className={`p-4 rounded-lg ${
                users.success 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  users.success ? 'text-blue-800' : 'text-red-800'
                }`}>
                  Users ({users.count || 0})
                </h3>
                {users.success ? (
                  <div className="text-blue-700">
                    <pre className="text-sm bg-blue-100 p-2 rounded overflow-auto">
                      {JSON.stringify(users.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-red-700">{users.error}</p>
                )}
              </div>
            )}

            {/* Stats Result */}
            {stats && (
              <div className={`p-4 rounded-lg ${
                stats.success 
                  ? 'bg-orange-50 border border-orange-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  stats.success ? 'text-orange-800' : 'text-red-800'
                }`}>
                  Database Statistics
                </h3>
                {stats.success ? (
                  <div className="text-orange-700">
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div className="bg-orange-100 p-2 rounded text-center">
                        <div className="text-2xl font-bold">{stats.data.users}</div>
                        <div className="text-sm">Users</div>
                      </div>
                      <div className="bg-orange-100 p-2 rounded text-center">
                        <div className="text-2xl font-bold">{stats.data.sessions}</div>
                        <div className="text-sm">Sessions</div>
                      </div>
                      <div className="bg-orange-100 p-2 rounded text-center">
                        <div className="text-2xl font-bold">{stats.data.forms}</div>
                        <div className="text-sm">Forms</div>
                      </div>
                    </div>
                    <p className="text-sm">Updated: {new Date(stats.data.timestamp).toLocaleString()}</p>
                  </div>
                ) : (
                  <p className="text-red-700">{stats.error}</p>
                )}
              </div>
            )}

            {/* Activity Result */}
            {activity && (
              <div className={`p-4 rounded-lg ${
                activity.success 
                  ? 'bg-cyan-50 border border-cyan-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  activity.success ? 'text-cyan-800' : 'text-red-800'
                }`}>
                  Recent Activity
                </h3>
                {activity.success ? (
                  <div className="text-cyan-700">
                    <p className="mb-2">Active Sessions: {activity.data.active_sessions}</p>
                    <div className="bg-cyan-100 p-2 rounded">
                      <h4 className="font-medium mb-1">Recent Users:</h4>
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(activity.data.recent_users, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-700">{activity.error}</p>
                )}
              </div>
            )}

            {/* Neon Auth Result */}
            {authResult && (
              <div className={`p-4 rounded-lg ${
                authResult.success 
                  ? 'bg-indigo-50 border border-indigo-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  authResult.success ? 'text-indigo-800' : 'text-red-800'
                }`}>
                  Neon Auth Configuration
                </h3>
                {authResult.success ? (
                  <div className="text-indigo-700">
                    <p>{authResult.message}</p>
                    {authResult.data && (
                      <div className="mt-2 space-y-2">
                        <div className="bg-indigo-100 p-2 rounded">
                          <strong>Database:</strong> {authResult.data.database}
                        </div>
                        <div className="bg-indigo-100 p-2 rounded">
                          <strong>Project ID:</strong> {authResult.data.auth_config.projectId}
                        </div>
                        <div className="bg-indigo-100 p-2 rounded">
                          <strong>Publishable Key:</strong> {authResult.data.auth_config.publishableKey}
                        </div>
                        <div className="bg-indigo-100 p-2 rounded">
                          <strong>Secret Key:</strong> {authResult.data.auth_config.secretKey}
                        </div>
                        <div className="bg-indigo-100 p-2 rounded">
                          <strong>Timestamp:</strong> {authResult.data.timestamp}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-red-700">{authResult.error}</p>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Make sure your <code className="bg-gray-200 px-1 rounded">.env.local</code> file has the correct <code className="bg-gray-200 px-1 rounded">DATABASE_URL</code></li>
              <li>2. Click "Test Connection" to verify Neon database connectivity</li>
              <li>3. Click "Create Tables" to set up the database schema</li>
              <li>4. Use other buttons to test various database operations</li>
              <li>5. Check your Neon console to see the data</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 