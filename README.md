# Multi-Tenant SaaS Profile Builder (Bento.me Clone)

A modern, production-ready multi-tenant SaaS platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Create customizable profile pages (link-in-bio style) with team collaboration, role-based access control, and comprehensive analytics.

## 🎯 Features

### Core Platform Features
- 🔐 **Authentication & Authorization**: Secure authentication with NextAuth.js, bcrypt password hashing, and JWT sessions
- 🏢 **True Multi-Tenancy**: Workspace-based organization with role-based access control (OWNER, ADMIN, EDITOR, VIEWER)
- 👥 **Team Collaboration**: Invite team members with different permission levels
- 🌐 **Public Profile Pages**: Clean, SEO-friendly URLs at `/{handle}`

### Profile Management
- ✏️ **Visual Editor**: Split-screen editor with live preview
- 📦 **Rich Content Blocks**:
  - **Link Blocks**: Call-to-action buttons with custom text
  - **Social Links**: Compact social media buttons
  - **Text Blocks**: Rich text content with formatting
  - **List Blocks**: Bullet-point lists for features, skills, etc.
  - **Embed Blocks**: YouTube, Spotify, and Twitch embeds
- 🎨 **Customization**: Taglines, avatar, bio, and theme support
- 📱 **Responsive Design**: Mobile-first, works on all devices

### Analytics & Tracking
- 📊 **Click Tracking**: Automatic tracking via `/go/{handle}/{blockId}` redirects
- 📈 **Analytics Dashboard**: View clicks by profile, date ranges (7/30 days)
- 🔍 **Detailed Reports**: Recent clicks, top profiles, referrer tracking

### Developer Experience
- 🚀 **Next.js 15 App Router**: Latest React Server Components
- 🎯 **TypeScript**: Full type safety
- 💾 **Prisma ORM**: Type-safe database access
- 🐳 **Docker Ready**: Complete Docker and Docker Compose setup
- 📝 **Comprehensive Seed Data**: Demo account with sample profiles

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.10 (App Router) with React 19
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 3.4
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.22
- **Authentication**: NextAuth.js 4.24 with bcrypt
- **Deployment**: Docker, Vercel, Render, Fly.io compatible

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ database
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/JhonaMath/bento.me-clone.git
cd bento.me-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bentoclone?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters-long"
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 4. Initialize the database

```bash
# Create migration (first time only)
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed demo data (optional but recommended)
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Try the demo account

After seeding, log in with:
- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Profile**: `/jhonamath`

## 🐳 Docker Deployment

### Using Docker Compose (Easiest)

```bash
# Start PostgreSQL + Next.js app
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

The app will be available at http://localhost:3000

### Manual Docker Build

```bash
# Build image
docker build -t bento-clone .

# Run with existing PostgreSQL
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/db" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret" \
  bento-clone
```

## 📁 Project Structure

```
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── profiles/             # Profile CRUD
│   │   ├── sections/             # Section CRUD
│   │   └── blocks/               # Block CRUD
│   ├── app/[tenantSlug]/         # Tenant-scoped routes
│   │   ├── page.tsx              # Workspace overview
│   │   ├── profiles/             # Profile management
│   │   └── analytics/            # Analytics dashboard
│   ├── auth/                     # Auth pages (signin/signup)
│   ├── dashboard/                # Main dashboard
│   ├── editor/[profileId]/       # Profile editor
│   ├── go/[handle]/[blockId]/    # Click tracking redirects
│   └── [handle]/                 # Public profile pages
├── components/                   # React components
│   ├── ProfileEditor.tsx         # Split-screen editor
│   ├── ProfileView.tsx           # Public profile view
│   ├── ProfilePreview.tsx        # Editor preview panel
│   ├── BlockEditor.tsx           # Block management
│   └── CreateProfileButton.tsx   # Profile creation modal
├── lib/                          # Utilities
│   ├── auth.ts                   # NextAuth configuration
│   ├── auth-helpers.ts           # Authorization helpers
│   └── prisma.ts                 # Prisma client
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script
│   └── migrations/               # Migration history
├── Dockerfile                    # Docker configuration
└── docker-compose.yml            # Compose setup
```

## 🔑 Key Routes

### Public Routes
- `/` - Landing page
- `/{handle}` - Public profile (e.g., `/jhonamath`)
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

### Protected Routes
- `/dashboard` - User dashboard (lists workspaces)
- `/app/{tenantSlug}` - Workspace overview
- `/app/{tenantSlug}/profiles` - Manage profiles
- `/app/{tenantSlug}/analytics` - Analytics dashboard
- `/editor/{profileId}` - Profile editor

### API Endpoints
- `POST /api/auth/signup` - Create account
- `POST /api/profiles` - Create profile
- `PATCH /api/profiles/{id}` - Update profile
- `POST /api/sections` - Create section
- `PATCH /api/sections/{id}` - Update section
- `DELETE /api/sections/{id}` - Delete section
- `POST /api/blocks` - Create block
- `PATCH /api/blocks/{id}` - Update block
- `DELETE /api/blocks/{id}` - Delete block
- `GET /go/{handle}/{blockId}` - Click tracking redirect

## 💾 Database Schema

### Core Models

**User** - User accounts
- `id`, `email`, `password`, `name`, `role`

**Tenant** - Workspaces
- `id`, `name`, `slug` (unique), `ownerId`

**Membership** - User-Tenant relationships
- `id`, `userId`, `tenantId`, `role` (OWNER/ADMIN/EDITOR/VIEWER)

**Profile** - Public profiles
- `id`, `handle` (unique), `displayName`, `tagline1`, `tagline2`, `bio`, `avatarUrl`, `themeJson`, `published`

**Section** - Content sections
- `id`, `profileId`, `title`, `order`

**Block** - Content blocks
- `id`, `sectionId`, `type`, `title`, `content`, `url`, `order`

**Click** - Analytics
- `id`, `tenantId`, `profileId`, `blockId`, `url`, `referrer`, `ipAddress`, `userAgent`, `createdAt`

**Invite** - Team invitations
- `id`, `tenantId`, `email`, `role`, `token`, `expiresAt`

**LinkPreviewCache** - OG metadata cache
- `id`, `url`, `title`, `description`, `image`, `favicon`

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT-based session management
- ✅ HTTP-only secure cookies
- ✅ CSRF protection
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ XSS prevention (React auto-escaping)
- ✅ Role-based access control (RBAC)
- ✅ Tenant isolation via authorization helpers
- ✅ Server-side authentication checks
- ✅ Environment variable secrets

## 👥 User Roles & Permissions

### Tenant Roles

| Role | Create/Edit Profiles | Delete Profiles | View Analytics | Invite Members | Manage Settings |
|------|---------------------|-----------------|----------------|----------------|-----------------|
| **OWNER** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **EDITOR** | ✅ | ❌ | ✅ | ❌ | ❌ |
| **VIEWER** | ❌ | ❌ | ✅ | ❌ | ❌ |

## 🎨 Customization

### Profile Themes

Profiles support custom themes via the `themeJson` field:

```json
{
  "primaryColor": "#3b82f6",
  "backgroundColor": "#ffffff",
  "textColor": "#1f2937"
}
```

Theme rendering can be extended in `ProfileView.tsx` and `ProfilePreview.tsx`.

## 📊 Analytics

The platform tracks:
- Total clicks (all time, 7 days, 30 days)
- Clicks by profile
- Recent click activity
- Referrer information
- User agent data
- IP addresses (anonymized)

Access analytics at `/app/{tenantSlug}/analytics`

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with demo data
```

### Database Commands

```bash
npx prisma studio              # Open Prisma Studio GUI
npx prisma migrate dev         # Create and apply migration
npx prisma migrate deploy      # Apply migrations (production)
npx prisma generate            # Generate Prisma Client
npx prisma db push             # Push schema without migration
npx prisma db seed             # Run seed script
```

## 🚢 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Render

1. Create new Web Service
2. Connect repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Fly.io

```bash
fly launch
fly secrets set DATABASE_URL="..." NEXTAUTH_SECRET="..." NEXTAUTH_URL="..."
fly deploy
```

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_URL` | Public URL of your app | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Generate with `openssl rand -base64 32` |

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run build` to ensure it compiles
5. Submit a pull request

## 📝 License

ISC

## 🙏 Acknowledgments

- Inspired by Bento.me (no branding or assets copied)
- Built with Next.js, Prisma, and the React ecosystem
- Authentication powered by NextAuth.js

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/JhonaMath/bento.me-clone/issues)
- **Discussions**: [GitHub Discussions](https://github.com/JhonaMath/bento.me-clone/discussions)

---

**Note**: This is an educational project and not affiliated with Bento.me. All code is original and no branding/assets were copied.