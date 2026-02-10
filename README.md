# Multi-Tenant Profile Builder

A modern multi-tenant SaaS platform built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Users can create personalized profile pages with various content blocks, embeds, and custom styling.

## Features

- 🔐 **Authentication & Authorization**: Secure user authentication with NextAuth.js and role-based access control
- 🏢 **Multi-tenancy**: Users can create workspaces (tenants) and manage multiple profiles
- 👤 **Custom Profiles**: Public profile pages accessible via unique handles (e.g., `/johnsmith`)
- ✏️ **Visual Editor**: Drag-and-drop editor with live preview for building profile pages
- 📦 **Block Types**: 
  - Link blocks with click tracking
  - Social media links
  - Text content
  - Lists
  - Rich embeds (YouTube, Spotify, Twitch)
- 📊 **Analytics**: Click tracking system for all link blocks via `/go/[handle]/[blockId]`
- 🎨 **Dynamic SEO**: Automatic meta tags and Open Graph support for profile pages
- 🐳 **Docker Support**: Complete Docker setup with docker-compose for easy deployment

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Deployment**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/JhonaMath/bento.me-clone.git
cd bento.me-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials and secrets:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bentoclone?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

### Docker Deployment

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Next.js application on port 3000

## Project Structure

```
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API routes
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # User dashboard
│   ├── editor/              # Profile editor
│   ├── go/                   # Click tracking redirects
│   └── [handle]/            # Public profile pages
├── components/               # React components
├── lib/                      # Utility functions
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
├── Dockerfile               # Docker configuration
└── docker-compose.yml       # Docker Compose setup
```

## Usage

### Creating an Account

1. Visit `/auth/signup`
2. Enter your details and workspace name
3. Sign in at `/auth/signin`

### Creating a Profile

1. From your dashboard, select a workspace
2. Click "Create Profile"
3. Choose a unique handle (username)
4. Add a display name

### Building Your Profile

1. Click "Edit" on any profile
2. Add sections to organize your content
3. Add blocks within sections:
   - **Link**: Create clickable buttons with URLs
   - **Social**: Add social media links
   - **Text**: Add formatted text content
   - **List**: Create bullet-point lists
   - **Embed**: Embed YouTube videos, Spotify tracks, or Twitch streams
4. See changes in real-time in the live preview
5. Click "Publish" to make your profile public

### Viewing Your Profile

Your profile will be accessible at `/{your-handle}`

### Analytics

Track clicks on your links via the dashboard. All link clicks are recorded with:
- Timestamp
- IP address
- User agent

## API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/profiles` - Create new profile
- `PATCH /api/profiles/[profileId]` - Update profile
- `POST /api/sections` - Create section
- `PATCH /api/sections/[sectionId]` - Update section
- `DELETE /api/sections/[sectionId]` - Delete section
- `POST /api/blocks` - Create block
- `PATCH /api/blocks/[blockId]` - Update block
- `DELETE /api/blocks/[blockId]` - Delete block
- `GET /go/[handle]/[blockId]` - Click tracking redirect

## Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **Tenant**: Workspaces owned by users
- **Profile**: Public profiles with unique handles
- **Section**: Organizational sections within profiles
- **Block**: Content blocks (links, text, embeds, etc.)
- **Click**: Click tracking data

## Security Features

- Password hashing with bcrypt
- JWT-based session management
- Role-based access control (USER, ADMIN)
- Protected API routes
- SQL injection prevention via Prisma

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.