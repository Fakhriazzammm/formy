import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, auth_sessions, type User, type PublicUser } from './schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 12;

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT utilities
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
}

// Authentication functions
export async function createUser(email: string, password: string, name: string): Promise<PublicUser> {
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  
  if (existingUser.length > 0) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(password);
  
  const [newUser] = await db.insert(users).values({
    email,
    name,
    password_hash: passwordHash,
  }).returning();

  // Return user without password hash
  const { password_hash, ...publicUser } = newUser;
  return publicUser;
}

export async function authenticateUser(email: string, password: string): Promise<PublicUser | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password_hash);
  
  if (!isValid) {
    return null;
  }

  // Return user without password hash
  const { password_hash, ...publicUser } = user;
  return publicUser;
}

export async function getUserById(id: number): Promise<PublicUser | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  
  if (!user) {
    return null;
  }

  // Return user without password hash
  const { password_hash, ...publicUser } = user;
  return publicUser;
}

export async function getUserByEmail(email: string): Promise<PublicUser | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  
  if (!user) {
    return null;
  }

  // Return user without password hash
  const { password_hash, ...publicUser } = user;
  return publicUser;
}

// Session management (optional)
export async function createSession(userId: number): Promise<string> {
  const token = generateToken(userId);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await db.insert(auth_sessions).values({
    user_id: userId,
    token,
    expires_at: expiresAt,
  });

  return token;
}

export async function invalidateSession(token: string): Promise<void> {
  await db.delete(auth_sessions).where(eq(auth_sessions.token, token));
} 