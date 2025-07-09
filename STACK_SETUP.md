# Stack (Neon Auth) Setup Guide

## 🚀 Quick Setup

### 1. Free Up Disk Space
First, you need to free up disk space on your system:
```bash
# Clear npm cache
npm cache clean --force

# Clear temporary files
# Windows: Disk Cleanup
# macOS/Linux: sudo rm -rf /tmp/*
```

### 2. Install Stack Package
```bash
npm install @stackframe/stack
```

### 3. Get Your Stack Credentials
1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Navigate to **Auth** section
4. Copy the credentials:
   - Project ID
   - Publishable Key
   - Secret Key

### 4. Update Environment Variables
Add to your `.env.local`:
```env
# Stack (Neon Auth) Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key
STACK_SECRET_SERVER_KEY=your-secret-key

# Your existing Neon database
DATABASE_URL=postgresql://neondb_owner:npg_uweN1rj4nUxF@ep-broad-fire-a1h3hfog-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 5. Test the Setup
```bash
# Start development server
npm run dev

# Visit test pages
http://localhost:3000/test-neon
http://localhost:3000/auth/stack
```

## 📁 Files Created

### Core Configuration
- `src/lib/stack.ts` - Stack client configuration
- `src/app/auth/stack/page.tsx` - Authentication page
- `src/app/actions.ts` - Server actions (updated)

### Test Pages
- `/test-neon` - Database and auth testing
- `/auth/stack` - Stack authentication UI

## 🔧 Usage Examples

### Server-Side (API Routes)
```typescript
import { stack } from '@/lib/stack';

// Get current user
const user = await stack.auth.getUser();

// Create user
const newUser = await stack.auth.createUser({
  email: 'user@example.com',
  password: 'password123'
});
```

### Client-Side (Components)
```typescript
import { stackClient } from '@/lib/stack';

// Sign in
await stackClient.auth.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Sign up
await stackClient.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});
```

## 🛡️ Security Notes

- **`NEXT_PUBLIC_*`** variables are available on client-side
- **`STACK_SECRET_SERVER_KEY`** is server-side only
- Never expose secret keys in client-side code
- Use environment variables in production

## 🔗 Integration with Existing Auth

Your project now has **dual authentication systems**:

1. **Custom JWT Auth** (existing) - Full control
2. **Stack Auth** (new) - Managed by Neon

### Migration Path
```typescript
// Option 1: Use Stack Auth for new features
import { stackClient } from '@/lib/stack';

// Option 2: Keep existing custom auth
import { useAuthStore } from '@/stores/useAuthStore';

// Option 3: Hybrid approach
// Use Stack for signup/login, custom JWT for sessions
```

## 🧪 Testing

### Test Database Connection
```bash
npm run db:test
```

### Test Stack Configuration
Visit: `http://localhost:3000/test-neon`
Click: "Test Stack" button

### Test Authentication
Visit: `http://localhost:3000/auth/stack`
Try: Sign up and sign in

## 📊 Environment Variables Reference

| Variable | Description | Client/Server |
|----------|-------------|---------------|
| `NEXT_PUBLIC_STACK_PROJECT_ID` | Your Stack project ID | Both |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | Public key for client | Client |
| `STACK_SECRET_SERVER_KEY` | Secret key for server | Server |
| `DATABASE_URL` | Neon database connection | Server |

## 🚨 Troubleshooting

### Disk Space Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Package Not Found
```bash
# Install Stack package
npm install @stackframe/stack

# If still failing, try:
npm install @stackframe/stack@latest
```

### Environment Variables
- Ensure all variables are set in `.env.local`
- Restart development server after changes
- Check for typos in variable names

## 🎯 Next Steps

1. **Free up disk space** and install the package
2. **Get Stack credentials** from Neon Console
3. **Update environment variables**
4. **Test the authentication**
5. **Integrate with your existing auth system**

## 📚 Resources

- [Stack Documentation](https://docs.stackframe.com/)
- [Neon Auth Guide](https://neon.tech/docs/guides/auth)
- [Next.js Auth Patterns](https://nextjs.org/docs/authentication)

---

**Ready to proceed?** Free up some disk space and run `npm install @stackframe/stack` to complete the setup! 