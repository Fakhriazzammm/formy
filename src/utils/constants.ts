// Color Palette
export const COLORS = {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Purple
  accent: '#06b6d4',       // Cyan
  success: '#10b981',      // Emerald
  warning: '#f59e0b',      // Amber
  error: '#ef4444',        // Red
  neutral: '#6b7280',      // Gray
  background: '#f8fafc',   // Slate-50
  surface: '#ffffff',      // White
} as const;

// Pricing
export const PRICING = {
  LINK_PRICE: 5000,        // Rp 5.000
  LINK_DURATION_DAYS: 7,   // 7 hari
  CURRENCY: 'IDR',
} as const;

// Form Field Types
export const FORM_FIELD_TYPES = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'textarea', label: 'Textarea', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'multiselect', label: 'Multi Select', icon: '☑️' },
  { value: 'radio', label: 'Radio Button', icon: '🔘' },
  { value: 'checkbox', label: 'Checkbox', icon: '✅' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'file', label: 'File Upload', icon: '📎' },
  { value: 'richtext', label: 'Rich Text', icon: '🎨' },
] as const;

// Form Templates Categories
export const TEMPLATE_CATEGORIES = [
  'Event Registration',
  'Survey & Feedback',
  'Job Application',
  'Contact Form',
  'Order Form',
  'Booking Form',
  'Newsletter Signup',
  'Support Ticket',
] as const;

// AI Prompt Templates
export const AI_PROMPTS = {
  FORM_GENERATOR: `Kamu adalah AI assistant yang membantu membuat form. Berdasarkan deskripsi user, buatkan struktur form yang sesuai dengan format JSON. Pastikan field yang dibuat relevan dan praktis.`,
  THEME_GENERATOR: `Kamu adalah AI assistant yang membantu membuat tema form. Berdasarkan industri atau kebutuhan yang disebutkan user, buatkan tema yang sesuai dengan warna, font, dan style yang tepat.`,
  FIELD_ENHANCER: `Kamu adalah AI assistant yang membantu memperbaiki dan menyempurnakan field form. Berikan saran untuk validasi, placeholder, dan opsi yang lebih baik.`,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+62|62|0)[\s-]?[0-9]{8,13}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// File Upload Settings
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALL: ['image/*', 'application/pdf', '.doc', '.docx'],
  },
} as const;

// Spreadsheet Integration
export const SPREADSHEET_TYPES = [
  { value: 'google_sheets', label: 'Google Sheets', icon: '📊' },
  { value: 'excel', label: 'Excel Online', icon: '📈' },
  { value: 'airtable', label: 'Airtable', icon: '🗃️' },
] as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'qris', label: 'QRIS', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'ewallet', label: 'E-Wallet', icon: '💳' },
  { value: 'credit_card', label: 'Credit Card', icon: '💳' },
] as const;

// Status Colors
export const STATUS_COLORS = {
  active: 'text-green-600 bg-green-100',
  expired: 'text-red-600 bg-red-100',
  pending: 'text-yellow-600 bg-yellow-100',
  draft: 'text-gray-600 bg-gray-100',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  FORMS: '/api/forms',
  SUBMISSIONS: '/api/submissions',
  PAYMENTS: '/api/payments',
  SHARED_LINKS: '/api/shared-links',
  AI_CHAT: '/api/ai/chat',
  ANALYTICS: '/api/analytics',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  FORM_DRAFT: 'formgen_form_draft',
  USER_PREFERENCES: 'formgen_user_preferences',
  THEME_CACHE: 'formgen_theme_cache',
} as const; 