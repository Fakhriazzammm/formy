import { pgTable, serial, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password_hash: text('password_hash').notNull(),
  email_verified: boolean('email_verified').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Auth sessions table (optional, for session management)
export const auth_sessions = pgTable('auth_sessions', {
  id: serial('id').primaryKey(),
  user_id: serial('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(1),
  password_hash: z.string().min(8),
});

export const selectUserSchema = createSelectSchema(users);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AuthSession = typeof auth_sessions.$inferSelect;
export type NewAuthSession = typeof auth_sessions.$inferInsert;

// Public user type (without password)
export type PublicUser = Omit<User, 'password_hash'>;

export const publicUserSchema = selectUserSchema.omit({ password_hash: true }); 