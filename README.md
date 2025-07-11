# Formy AI 🚀

Platform SaaS yang memungkinkan pengguna membuat form kustom dengan bantuan AI, terintegrasi langsung ke spreadsheet, dan monetisasi berbasis pay-per-link (Rp 5.000/link, aktif 7 hari).

## ✨ Fitur Utama

### 1. 🤖 Form Builder dengan AI
- **AI Chat Interface**: Deskripsikan kebutuhan form, AI membuatkan otomatis
- **Manual Input + AI Enhancement**: Input manual yang disempurnakan AI
- **Komponen Lengkap**: Text, Dropdown, Multi-select, Rich Text, File Upload, Date/Time, Number, Radio, Checkbox, Conditional Logic

### 2. 🎨 Theme Generator
- **AI-Powered Themes**: Generate tema berdasarkan industri/kebutuhan
- **Pre-built Templates**: Koleksi tema siap pakai
- **Custom Styling**: Color scheme, typography, layout customization
- **Brand Integration**: Logo upload, brand colors

### 3. 📊 Spreadsheet Integration
- **Multi-platform Support**: Google Sheets, Excel Online, Airtable
- **Real-time Sync**: Data form langsung masuk ke spreadsheet
- **Field Mapping**: Otomatis mapping field form ke kolom spreadsheet
- **Data Validation**: Validasi data sebelum masuk ke spreadsheet

### 4. 💳 Pay-per-Share Model
- **Free Form Creation**: Buat dan preview form gratis
- **Payment Gateway**: Bayar Rp 5.000 untuk generate link (Midtrans)
- **1 Week Duration**: Link aktif selama 7 hari
- **Custom Slug**: Domain utama + custom slug
- **Link Management**: Status aktif/expired, analytics, renewal option

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 & Next.js 15 dengan TypeScript
- **Styling**: Tailwind CSS 4 + Shadcn/UI + Headless UI
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Rich Text**: Tiptap editor
- **File Upload**: React Dropzone
- **Charts**: Recharts untuk analytics

### Backend Services
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage
- **AI Integration**: Gemini API
- **Payment**: Midtrans API
- **Email**: Resend API

### Key Libraries
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.50.4",
    "midtrans-client": "^1.4.3",
    "react-hook-form": "^7.60.0",
    "zod": "^3.25.76",
    "zustand": "^5.0.6",
    "@tiptap/react": "^2.25.0",
    "react-dropzone": "^14.3.8",
    "framer-motion": "^12.23.1",
    "openai": "^5.8.3",
    "date-fns": "^4.1.0"
  }
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Supabase account (untuk database)
- OpenAI/Gemini API key (untuk AI features)
- Midtrans account (untuk payment)

### Installation

1. **Clone repository**
```bash
git clone https://github.com/your-username/formgen-ai.git
cd formgen-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan konfigurasi Anda:
```env
# Neon Database Configuration
# Get your connection string from: https://console.neon.tech/
DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require

# Neon Auth Configuration (formerly Stack)
# Get these from: https://console.neon.tech/ -> Your Project -> Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your-neon-auth-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-neon-auth-publishable-key
STACK_SECRET_SERVER_KEY=your-neon-auth-secret-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# AI Configuration
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key

# Payment Configuration
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false

# Email Configuration
RESEND_API_KEY=your-resend-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FormGen AI
```

4. **Setup database**
```bash
# Run database migrations
npm run db:migrate

# Test database connection
npm run db:test

# Optional: Open Drizzle Studio (database GUI)
npm run db:studio
```

5. **Start development server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📁 Struktur Project

```
formgen/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── builder/         # Form builder pages
│   │   ├── payment/         # Payment pages
│   │   ├── f/              # Generated form pages
│   │   ├── links/          # Link management pages
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/             # Shadcn/UI components
│   │   ├── forms/          # Form-related components
│   │   └── layout/         # Layout components
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand stores
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── lib/                # Library configurations
├── public/                 # Static files
├── package.json
└── README.md
```

## 🎨 UI/UX Design System

### Color Palette
```css
:root {
  --primary: #6366f1;      /* Indigo */
  --secondary: #8b5cf6;    /* Purple */
  --accent: #06b6d4;       /* Cyan */
  --success: #10b981;      /* Emerald */
  --warning: #f59e0b;      /* Amber */
  --error: #ef4444;        /* Red */
  --neutral: #6b7280;      /* Gray */
  --background: #f8fafc;   /* Slate-50 */
  --surface: #ffffff;      /* White */
}
```

### Typography
- **Primary**: Inter (clean, modern)
- **Heading**: Cal Sans (friendly, approachable)
- **Code**: JetBrains Mono

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Auth Sessions Table
```sql
CREATE TABLE auth_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Forms Table
```sql
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  theme JSONB NOT NULL,
  spreadsheet_config JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Shared Links Table
```sql
CREATE TABLE shared_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id),
  user_id UUID REFERENCES users(id),
  slug VARCHAR UNIQUE NOT NULL,
  payment_id UUID REFERENCES payments(id),
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📊 API Endpoints

### Forms API
- `GET /api/forms` - Get user forms
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Submissions API
- `GET /api/submissions/:formId` - Get form submissions
- `POST /api/submissions` - Submit form data

### Payments API
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment status

### AI API
- `POST /api/ai/chat` - AI chat for form generation
- `POST /api/ai/theme` - AI theme generation

## 💰 Monetization

### Simple Pay-per-Use Model
- **Free**: Form creation, preview, testing
- **Paid**: Rp 5.000 per link generation (7 hari aktif)
- **Extensions**: User bisa extend link yang expired dengan bayar lagi

### Revenue Projections
- **Target**: 100 link generations per hari
- **Revenue**: Rp 500.000 per hari
- **Monthly**: ~Rp 15.000.000
- **Annual**: ~Rp 180.000.000

## 🔒 Security & Performance

### Security
- **Authentication**: JWT tokens with refresh
- **Authorization**: Row-level security (RLS)
- **Input Validation**: Zod schemas
- **Rate Limiting**: API request limits
- **XSS Protection**: Content sanitization
- **Payment Security**: Midtrans secure payment

### Performance
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format, lazy loading
- **Caching**: React Query for API caching
- **Bundle Size**: Tree shaking, minimal dependencies

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run all tests
npm run test:all
```

## 📦 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker
```bash
# Build image
docker build -t formgen-ai .

# Run container
docker run -p 3000:3000 formgen-ai
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Developed by Zantara Technology**

- **Lead Developer**: [Your Name]
- **UI/UX Designer**: [Designer Name]
- **DevOps Engineer**: [DevOps Name]

## 📞 Support

- **Email**: support@formgen.ai
- **Documentation**: [https://docs.formgen.ai](https://docs.formgen.ai)
- **Discord**: [Join our Discord](https://discord.gg/formgen)

---

**FormGen AI** - Buat Form Kustom dengan AI 🚀
