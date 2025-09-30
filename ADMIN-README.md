# Next.js Admin Interface for Kathy Polensky Real Estate

This is a Next.js admin interface for manually adding MLS listings to the Kathy Polensky real estate website.

## 🚀 Features

- **Secure Authentication** - Password-protected admin access
- **Form Validation** - React Hook Form with Zod validation
- **Database Integration** - Prisma with Vercel Postgres
- **Upsert Functionality** - Updates existing listings or creates new ones
- **Error Handling** - Comprehensive error handling and user feedback
- **Responsive Design** - Bootstrap styling matching the main website theme

## 📋 Prerequisites

- Node.js 18+ 
- Vercel Postgres database
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Copy the Next.js package.json
cp package-nextjs.json package.json

# Install dependencies
npm install
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 3. Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kathy_polensky_db?schema=public"

# Admin Authentication
ADMIN_PASSWORD="kathy-admin-2024"
ADMIN_TOKEN="kathy-admin-2024"
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/admin` to access the admin interface.

## 📁 File Structure

```
admin/
├── page.tsx                 # Main admin page component
app/
├── api/
│   ├── auth/
│   │   └── route.ts        # Authentication API
│   └── listings/
│       └── route.ts        # Listings CRUD API
prisma/
└── schema.prisma           # Database schema
```

## 🔐 Authentication

The admin interface uses simple password authentication:

**Default Passwords:**
- `kathy-admin-2024`
- `polensky2024`
- `realtyexec2024`
- `watertown2024`

## 📊 Database Schema

```sql
CREATE TABLE listings (
  id          TEXT PRIMARY KEY,
  mlsNumber   TEXT UNIQUE NOT NULL,
  address     TEXT NOT NULL,
  price       INTEGER NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('Active', 'Pending', 'Sold')),
  description TEXT,
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);
```

## 🎯 API Endpoints

### POST /api/auth
Authenticate admin user.

**Request:**
```json
{
  "password": "kathy-admin-2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "kathy-admin-2024",
  "expiresIn": 3600
}
```

### POST /api/listings
Create or update a listing.

**Request:**
```json
{
  "mlsNumber": "1929100",
  "address": "305 Theresa St, Watertown, WI 53094",
  "price": 324900,
  "status": "Active",
  "description": "Beautiful 3BR/2BA home..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "id": "clx1234567890",
    "mlsNumber": "1929100",
    "address": "305 Theresa St, Watertown, WI 53094",
    "price": 324900,
    "status": "Active",
    "action": "created"
  }
}
```

## 🚀 Deployment to Vercel

### 1. Connect to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Set Environment Variables

In Vercel dashboard:
- `DATABASE_URL` - Your Vercel Postgres connection string
- `ADMIN_PASSWORD` - Admin password
- `ADMIN_TOKEN` - API authentication token

### 3. Database Migration

```bash
# Push schema to production database
npx prisma db push --schema=./prisma/schema.prisma
```

## 🔧 Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| MLS Number | String | Yes | Alphanumeric + hyphens, unique |
| Address | String | Yes | 5-500 characters |
| Price | Number | Yes | Positive integer, max $999M |
| Status | Enum | Yes | Active, Pending, or Sold |
| Description | String | No | Max 2000 characters |

## 🛡️ Security Features

- **Authentication Required** - All API endpoints require valid token
- **Input Validation** - Zod schema validation on all inputs
- **SQL Injection Protection** - Prisma ORM prevents SQL injection
- **Error Handling** - No sensitive data exposed in error messages
- **Rate Limiting** - Can be added with Vercel Edge Config

## 🎨 Styling

The admin interface uses Bootstrap 5 with the same blue/gray theme as the main website:

- **Primary Color:** #17a9c2
- **Secondary Color:** #64748b
- **Background:** #f8fafc
- **Dark Theme:** #1e293b

## 📱 Responsive Design

- **Desktop:** Full-width form with side-by-side fields
- **Tablet:** Stacked form fields
- **Mobile:** Optimized for touch interaction

## 🔄 Upsert Behavior

When adding a listing:
- If MLS number exists → Updates existing listing
- If MLS number is new → Creates new listing
- Returns action type (`created` or `updated`)

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check `DATABASE_URL` environment variable
   - Ensure Vercel Postgres is running

2. **Authentication Failed**
   - Verify `ADMIN_PASSWORD` matches
   - Check token in request headers

3. **Validation Errors**
   - Check field requirements and formats
   - Ensure all required fields are provided

4. **Prisma Client Error**
   - Run `npx prisma generate`
   - Check database schema is up to date

## 📞 Support

For issues or questions:
- Check the main website: https://cdogmx.github.io/KathyPolensky/
- Review API responses for error details
- Check Vercel function logs for server errors
