import { pgTable, serial, text, timestamp, boolean, varchar, uuid, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { sql } from "drizzle-orm";

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

// Forms table
export const forms = pgTable('forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  config: jsonb('config').notNull(),
  theme: jsonb('theme'),
  spreadsheet_config: jsonb('spreadsheet_config'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  mayar_order_id: varchar('mayar_order_id', { length: 64 }).notNull(),
  amount: serial('amount').notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  customer: jsonb('customer'),
  method: varchar('method', { length: 32 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const payment_links = pgTable('payment_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  payment_id: uuid('payment_id').references(() => payments.id),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  expires_at: timestamp('expires_at'),
});

// Shared Links table
export const shared_links = pgTable('shared_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  form_id: uuid('form_id').references(() => forms.id),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  payment_id: uuid('payment_id').references(() => payments.id),
  expires_at: timestamp('expires_at'),
  created_at: timestamp('created_at').defaultNow(),
});

// Submissions table
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  form_id: uuid('form_id').references(() => forms.id),
  data: jsonb('data').notNull(),
  analytics: jsonb('analytics'),
  created_at: timestamp('created_at').defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(1),
  password_hash: z.string().min(8),
});

export const selectUserSchema = createSelectSchema(users);

// Zod schemas for new tables
export const insertFormSchema = createInsertSchema(forms);
export const selectFormSchema = createSelectSchema(forms);
export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
export const insertSharedLinkSchema = createInsertSchema(shared_links);
export const selectSharedLinkSchema = createSelectSchema(shared_links);
export const insertSubmissionSchema = createInsertSchema(submissions);
export const selectSubmissionSchema = createSelectSchema(submissions);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AuthSession = typeof auth_sessions.$inferSelect;
export type NewAuthSession = typeof auth_sessions.$inferInsert;

// Types for new tables
export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type SharedLink = typeof shared_links.$inferSelect;
export type NewSharedLink = typeof shared_links.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

// Public user type (without password)
export type PublicUser = Omit<User, 'password_hash'>;

export const publicUserSchema = selectUserSchema.omit({ password_hash: true }); 