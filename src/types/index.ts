// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Public User Type (without sensitive data)
export interface PublicUser {
  id: number;
  email: string;
  name: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Auth Session Types
export interface AuthSession {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

// Form Field Types
export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'number'
  | 'email'
  | 'date'
  | 'file'
  | 'richtext';

export interface FormField {
  id: string;
  type: FormFieldType;
  name?: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: string[];
  defaultValue?: string | number;
  value?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  hidden?: boolean;
  disabled?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditional?: {
    dependsOn: string;
    value: string;
  };
}

// Form Types
export interface Form {
  id: string;
  user_id: number;
  title: string;
  description?: string;
  fields: FormField[];
  theme: FormTheme;
  spreadsheet_config?: SpreadsheetConfig;
  created_at: string;
  updated_at: string;
}

// Theme Types
export interface FormTheme {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  logo_url?: string;
  custom_css?: string;
}

// Spreadsheet Configuration
export interface SpreadsheetConfig {
  type: 'google_sheets' | 'excel' | 'airtable';
  url: string;
  field_mapping: Record<string, string>;
}

// Shared Link Types
export interface SharedLink {
  id: string;
  form_id: string;
  user_id: number;
  slug: string;
  payment_id: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  views: number;
  submissions: number;
}

// Submission Types
export interface Submission {
  id: string;
  shared_link_id: string;
  form_id: string;
  data: Record<string, unknown>;
  submitted_at: string;
  ip_address?: string;
  user_agent?: string;
}

// Payment Types
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired';

export interface Payment {
  id: string;
  user_id: number;
  form_id: string;
  midtrans_order_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  created_at: string;
  paid_at?: string;
  customer?: { name: string; email: string };
  payment_url?: string;
  slug?: string;
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  form_id: string;
  messages: ChatMessage[];
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_forms: number;
  active_links: number;
  expired_links: number;
  total_submissions: number;
  total_revenue: number;
}

// Template Types
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: FormField[];
  theme: FormTheme;
  preview_image?: string;
}

// Analytics Types
export interface LinkAnalytics {
  link_id: string;
  views: number;
  submissions: number;
  conversion_rate: number;
  daily_stats: {
    date: string;
    views: number;
    submissions: number;
  }[];
}