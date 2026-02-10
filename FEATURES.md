# Features Documentation

## Authentication & User Management

### Sign Up
- Users create an account with email and password
- Passwords are hashed using bcrypt before storage
- Each user must create a workspace (tenant) during signup
- Automatic role assignment (USER by default)

### Sign In
- Email and password authentication
- JWT-based session management via NextAuth.js
- Sessions persist across browser sessions
- Secure HTTP-only cookies

### Roles
- **USER**: Standard user with access to their own workspaces and profiles
- **ADMIN**: Administrator with elevated permissions (extendable)

## Multi-Tenancy

### Workspaces (Tenants)
- Users can own multiple workspaces
- Each workspace can contain multiple profiles
- Workspaces provide logical separation for different use cases
- Examples: Personal brand, business, project, etc.

## Profile Management

### Creating Profiles
- Unique handle (username) per profile
- Handle format: lowercase letters, numbers, and hyphens
- Display name for presentation
- Optional bio and avatar
- Publish/unpublish toggle for visibility control

### Profile URLs
- Public profiles accessible at `/{handle}`
- Clean, memorable URLs
- SEO-friendly structure

## Content Blocks

### Block Types

#### 1. Link Block
- Call-to-action buttons with custom text
- Redirects to any URL
- Click tracking enabled
- Perfect for: Portfolio links, store links, contact forms

#### 2. Social Block
- Compact social media links
- Custom platform and URL
- Click tracking enabled
- Perfect for: Twitter, LinkedIn, GitHub, etc.

#### 3. Text Block
- Rich text content
- Multi-line support with preserved formatting
- No click tracking
- Perfect for: Descriptions, announcements, quotes

#### 4. List Block
- Bullet-point lists
- Optional title
- Multiple items (one per line)
- No click tracking
- Perfect for: Skills, features, services

#### 5. Embed Block
- Rich media embeds
- Supported platforms:
  - **YouTube**: Automatically embeds videos from URLs
  - **Spotify**: Embeds tracks, albums, and playlists
  - **Twitch**: Embeds live streams and channels
- Responsive design
- Perfect for: Showcasing content, music, streams

### Sections
- Organize blocks into logical sections
- Optional section titles
- Drag-and-drop ordering (via order field)
- Multiple blocks per section

## Editor Features

### Split-Screen Editor
- **Left Panel**: Edit mode with form controls
- **Right Panel**: Live preview
- Changes reflect immediately
- Visual feedback for all modifications

### Profile Settings
- Display name editing
- Bio editing with multi-line support
- Avatar URL (for future file upload integration)
- Publish/unpublish toggle

### Section Management
- Add unlimited sections
- Edit section titles inline
- Delete sections (cascades to blocks)
- Automatic ordering

### Block Management
- Add blocks with type selection
- Edit inline with immediate updates
- Delete blocks
- Automatic ordering within sections

## Analytics & Tracking

### Click Tracking
- All link and social blocks are tracked
- Tracked data:
  - Timestamp
  - IP address (for analytics)
  - User agent (browser info)
  - Associated profile and block

### Redirect System
- Links use `/go/{handle}/{blockId}` format
- Transparent redirection
- Server-side tracking before redirect
- Maintains SEO value

### Future Analytics (Extensible)
- Click count aggregation
- Unique visitor tracking
- Geographic analytics
- Referrer tracking
- Time-based analytics

## SEO & Metadata

### Dynamic Meta Tags
- Automatic title generation from display name/handle
- Description from profile bio
- Open Graph tags for social media sharing
- Twitter Card support
- Profile image as social preview

### Search Engine Optimization
- Server-side rendering for instant indexing
- Semantic HTML structure
- Clean URLs without query parameters
- Proper heading hierarchy

## Security Features

### Authentication Security
- Password hashing with bcrypt (10 rounds)
- HTTP-only session cookies
- CSRF protection via NextAuth.js
- Secure session storage

### Authorization
- User can only access their own data
- API route protection
- Role-based access control foundation
- Tenant ownership verification

### Data Validation
- Input validation on all forms
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (React auto-escaping)
- Handle uniqueness validation

### Privacy
- Click tracking is anonymous by default
- IP addresses stored for analytics only
- User agent info for compatibility tracking
- No third-party analytics by default

## Extensibility

### Adding New Block Types
1. Add enum value to Prisma schema
2. Update BlockEditor component with new form fields
3. Update ProfilePreview/ProfileView with rendering logic
4. Run migration

### Adding File Uploads
1. Install file upload library (e.g., uploadthing, cloudinary)
2. Create upload API endpoints
3. Add file input to ProfileEditor
4. Store URLs in database

### Adding Analytics Dashboard
1. Create `/dashboard/analytics` route
2. Query Click table with aggregations
3. Use charting library (e.g., recharts, chart.js)
4. Add date range filters

### Adding Custom Themes
1. Add theme field to Profile model
2. Create theme configurations
3. Apply theme classes in ProfileView
4. Add theme selector in editor

## API Reference

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `GET /api/auth/signout` - Sign out (handled by NextAuth)

### Profiles
- `POST /api/profiles` - Create new profile
- `PATCH /api/profiles/[profileId]` - Update profile

### Sections
- `POST /api/sections` - Create new section
- `PATCH /api/sections/[sectionId]` - Update section
- `DELETE /api/sections/[sectionId]` - Delete section

### Blocks
- `POST /api/blocks` - Create new block
- `PATCH /api/blocks/[blockId]` - Update block
- `DELETE /api/blocks/[blockId]` - Delete block

### Click Tracking
- `GET /go/[handle]/[blockId]` - Track click and redirect

## Performance Considerations

### Database
- Indexed fields: email, handle, sessionToken
- Cascading deletes for data consistency
- Optimized queries with Prisma
- Connection pooling ready

### Caching
- Static generation for landing page
- Dynamic rendering for profiles
- Edge caching compatible
- Ready for CDN integration

### Bundle Size
- Server components for reduced JS
- Code splitting by route
- Minimal client-side JavaScript
- Lazy loading for embeds

## Accessibility

### Keyboard Navigation
- All interactive elements keyboard accessible
- Proper tab order
- Enter key support for forms

### Screen Readers
- Semantic HTML structure
- ARIA labels where needed
- Alt text for images

### Color Contrast
- WCAG AA compliant colors
- High contrast mode support
- Focus indicators

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

1. **File Uploads**: Avatar URLs are text inputs (no upload yet)
2. **Drag-and-Drop**: Ordering is numeric (no visual drag-and-drop)
3. **Rich Text**: Text blocks are plain text (no markdown/rich text)
4. **Themes**: Single default theme (no customization yet)
5. **Analytics Dashboard**: Click data is stored but no dashboard yet

These limitations are intentional to keep the initial implementation focused and can be added as enhancements.
