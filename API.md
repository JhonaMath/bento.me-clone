# API Documentation

## Authentication

All protected endpoints require authentication via NextAuth.js session.

### POST `/api/auth/signup`
Create a new user account with workspace.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "tenantName": "My Workspace"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "userId": "cuid123",
  "tenantSlug": "my-workspace"
}
```

**Errors:**
- `400` - All fields required / User already exists / Unable to generate unique slug
- `500` - Internal server error

---

## Profiles

### POST `/api/profiles`
Create a new profile in a tenant.

**Authorization:** EDITOR, ADMIN, or OWNER role required

**Request Body:**
```json
{
  "tenantId": "cuid123",
  "handle": "johndoe",
  "displayName": "John Doe"
}
```

**Response (201):**
```json
{
  "id": "cuid456",
  "handle": "johndoe",
  "displayName": "John Doe",
  "tagline1": null,
  "tagline2": null,
  "bio": null,
  "avatarUrl": null,
  "themeJson": null,
  "tenantId": "cuid123",
  "published": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Errors:**
- `400` - Handle already taken / Invalid handle format
- `403` - Insufficient permissions
- `401` - Unauthorized

### PATCH `/api/profiles/[profileId]`
Update an existing profile.

**Authorization:** EDITOR, ADMIN, or OWNER role required

**Request Body:**
```json
{
  "displayName": "John Doe Updated",
  "tagline1": "👨‍💻 Developer",
  "tagline2": "🚀 Entrepreneur",
  "bio": "Building amazing things",
  "avatarUrl": "https://example.com/avatar.jpg",
  "themeJson": "{\"primaryColor\":\"#3b82f6\"}",
  "published": true
}
```

**Response (200):**
```json
{
  "id": "cuid456",
  "handle": "johndoe",
  "displayName": "John Doe Updated",
  // ... other fields
}
```

**Errors:**
- `403` - Access denied
- `404` - Profile not found

---

## Sections

### POST `/api/sections`
Create a new section in a profile.

**Authorization:** EDITOR, ADMIN, or OWNER role required

**Request Body:**
```json
{
  "profileId": "cuid456",
  "title": "Featured Work",
  "order": 1
}
```

**Response (201):**
```json
{
  "id": "cuid789",
  "profileId": "cuid456",
  "title": "Featured Work",
  "order": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "blocks": []
}
```

### PATCH `/api/sections/[sectionId]`
Update a section.

**Authorization:** EDITOR, ADMIN, or OWNER role required

**Request Body:**
```json
{
  "title": "Updated Title",
  "order": 2
}
```

### DELETE `/api/sections/[sectionId]`
Delete a section and all its blocks.

**Authorization:** EDITOR, ADMIN, or OWNER role required

**Response (200):**
```json
{
  "message": "Section deleted"
}
```

---

## Blocks

### POST `/api/blocks`
Create a new block in a section.

**Authorization:** EDITOR, ADMIN, or OWNER role required

**Request Body:**
```json
{
  "sectionId": "cuid789",
  "type": "LINK",
  "order": 1
}
```

**Block Types:**
- `LINK` - Link button
- `SOCIAL` - Social media link
- `TEXT` - Text content
- `LIST` - Bullet list
- `EMBED` - YouTube/Spotify/Twitch embed

**Response (201):**
```json
{
  "id": "cuid101",
  "sectionId": "cuid789",
  "type": "LINK",
  "title": null,
  "content": "",
  "url": null,
  "order": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### PATCH `/api/blocks/[blockId]`
Update a block.

**Authorization:** EDITOR, ADMIN, or OWNER role required

**Request Body (LINK):**
```json
{
  "title": "My Portfolio",
  "url": "https://example.com",
  "order": 1
}
```

**Request Body (TEXT):**
```json
{
  "content": "This is my story...",
  "order": 2
}
```

**Request Body (LIST):**
```json
{
  "title": "Skills",
  "content": "[\"JavaScript\",\"TypeScript\",\"React\"]",
  "order": 3
}
```

**Request Body (EMBED):**
```json
{
  "content": "https://www.youtube.com/watch?v=...",
  "url": "https://www.youtube.com/watch?v=...",
  "order": 4
}
```

### DELETE `/api/blocks/[blockId]`
Delete a block.

**Authorization:** EDITOR, ADMIN, or OWNER role required

**Response (200):**
```json
{
  "message": "Block deleted"
}
```

---

## Click Tracking

### GET `/go/[handle]/[blockId]`
Track a click and redirect to URL.

**Public endpoint** - No authentication required

**Flow:**
1. Records click with metadata (IP, user agent, referrer)
2. Redirects (302) to block's URL

**Tracked Data:**
- `tenantId` - Workspace
- `profileId` - Profile
- `blockId` - Block clicked
- `url` - Destination URL
- `referrer` - Referrer URL
- `ipAddress` - Visitor IP (anonymized)
- `userAgent` - Browser info
- `createdAt` - Timestamp

**Errors:**
- `404` - Profile or block not found

---

## Authorization Helpers

### `requireUser()`
Verify user is authenticated.

**Returns:**
```typescript
{
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}
```

**Throws:** `Error` if not authenticated

### `requireTenantMembership(tenantSlug, minRole)`
Verify user has required role in tenant.

**Parameters:**
- `tenantSlug` - Tenant slug
- `minRole` - Minimum role required (VIEWER, EDITOR, ADMIN, OWNER)

**Returns:**
```typescript
{
  user: User
  tenant: Tenant
  membership: Membership
}
```

**Throws:** `Error` if no access

### `requireProfileAccess(profileId, minRole)`
Verify user has required role for profile's tenant.

**Parameters:**
- `profileId` - Profile ID
- `minRole` - Minimum role required

**Returns:**
```typescript
{
  user: User
  profile: Profile
  tenant: Tenant
  membership: Membership
}
```

**Throws:** `Error` if no access

---

## Role Hierarchy

Roles are hierarchical (each includes permissions of lower roles):

1. **OWNER** (highest)
   - All ADMIN permissions
   - Transfer ownership
   - Delete tenant

2. **ADMIN**
   - All EDITOR permissions
   - Invite/remove members
   - Manage tenant settings
   - Delete profiles

3. **EDITOR**
   - All VIEWER permissions
   - Create/edit profiles
   - Create/edit/delete sections
   - Create/edit/delete blocks
   - Publish/unpublish profiles

4. **VIEWER** (lowest)
   - View profiles
   - View analytics

---

## Rate Limiting

Currently not implemented. Consider adding for production:

```typescript
// Example with express-rate-limit
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

---

## Error Codes

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Human-readable error message"
}
```

---

## Webhooks (Future)

Planned webhook support for:
- Profile published/unpublished
- New click tracked
- Member invited/joined
- Profile updated

**Webhook Payload Example:**
```json
{
  "event": "profile.published",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "profileId": "cuid456",
    "handle": "johndoe",
    "tenantId": "cuid123"
  }
}
```
