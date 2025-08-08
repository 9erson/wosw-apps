# Authentication Setup Guide

This guide will help you set up authentication for the Ideas App using Supabase.

## 🚀 Quick Setup

### 1. Database Migration
Run the SQL migration in your Supabase project:

```sql
-- Apply the migration file
-- Execute: supabase/migrations/001_add_auth_and_rls.sql
```

Or run these commands in your Supabase SQL editor:

```sql
-- Add user_id columns to existing tables
ALTER TABLE "IdeaTopic" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE "IdeaTopic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Idea" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (see full migration file for complete policies)
```

### 2. Environment Variables
Copy the example environment file and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase project details:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Run Development Server
```bash
pnpm dev
```

## 🔐 Authentication Features

### ✅ Implemented Features
- **User Registration**: Secure sign-up with email/password
- **User Login**: Authentication with session management
- **Route Protection**: Middleware protects `/ideas` routes
- **API Security**: All API endpoints require authentication
- **User Isolation**: Users can only see/manage their own data
- **Session Management**: Automatic token refresh
- **Responsive UI**: Mobile-friendly auth forms with daisyUI

### 🛡️ Security Features
- **Row Level Security (RLS)**: Database-level user isolation
- **JWT Tokens**: Secure authentication tokens
- **PKCE Flow**: Secure OAuth flow
- **Middleware Protection**: Server-side route guards
- **API Authentication**: Protected API endpoints
- **Input Validation**: Zod schema validation

## 📱 User Experience

### Authentication Flow
1. **Unauthenticated Users**: Redirected to login page
2. **Registration**: Strong password requirements with validation
3. **Login**: Secure login with error handling
4. **Dashboard**: Protected ideas page with user-specific data
5. **Logout**: Secure session termination

### UI Components
- **LoginForm**: Email/password login with forgot password link
- **SignUpForm**: Registration with password strength requirements
- **UserMenu**: Profile dropdown with user info and logout
- **ProtectedRoute**: Client-side route protection wrapper

## 🔧 Technical Architecture

### Database Schema
```sql
-- User profiles table
profiles (id, email, display_name, avatar_url, created_at, updated_at)

-- Updated existing tables with user ownership
"IdeaTopic" (id, user_id, name, description, tags, createdAt, updatedAt)
"Idea" (id, user_id, name, description, tags, rating, feedback, ideaTopicId, createdAt, updatedAt)
```

### File Structure
```
├── app/
│   ├── auth/
│   │   ├── layout.tsx        # Auth pages layout
│   │   ├── login/page.tsx    # Login page
│   │   └── signup/page.tsx   # Sign up page
│   ├── ideas/page.tsx        # Protected ideas page
│   └── api/                  # Protected API routes
├── components/auth/
│   ├── LoginForm.tsx         # Login form component
│   ├── SignUpForm.tsx        # Registration form
│   ├── UserMenu.tsx          # User navigation menu
│   └── ProtectedRoute.tsx    # Route protection wrapper
├── lib/
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── auth/
│   │   └── server.ts         # Server-side auth utilities
│   └── supabase/
│       ├── client.ts         # Client-side Supabase config
│       └── server.ts         # Server-side Supabase config
├── middleware.ts             # Route protection middleware
└── supabase/migrations/      # Database migrations
```

### API Authentication
All API routes now require authentication:
- `GET /api/ideas` - Returns user's ideas only
- `POST /api/ideas` - Creates ideas for authenticated user
- `GET /api/idea-topics` - Returns user's topics only
- `POST /api/idea-topics` - Creates topics for authenticated user

### Service Layer Updates
All service methods now include user context:
```typescript
// Before
IdeasService.findAll(search?)
IdeasService.create(data)

// After (with user isolation)
IdeasService.findAll(userId, search?)
IdeasService.create(userId, data)
```

## 🧪 Testing the Implementation

### Manual Testing Steps
1. **Visit the app** - Should show login/signup options
2. **Create account** - Register with email/password
3. **Login** - Sign in with credentials
4. **Access ideas page** - Should work and show user-specific data
5. **Logout** - Should clear session and redirect
6. **Try accessing protected routes** - Should redirect to login

### Security Testing
1. **User isolation** - Create two accounts and verify data separation
2. **API protection** - Try accessing API endpoints without auth
3. **Route protection** - Try accessing `/ideas` without login
4. **Session management** - Test token refresh and expiration

## 🐛 Troubleshooting

### Common Issues

#### 1. Supabase Connection Error
- Verify environment variables are set correctly
- Check Supabase project URL and keys
- Ensure project is not paused

#### 2. Authentication Not Working
- Check if RLS policies are enabled
- Verify migration was applied correctly
- Check browser console for errors

#### 3. Database Permission Errors
- Ensure RLS policies are correctly configured
- Check if user_id columns exist in tables
- Verify foreign key constraints are properly set

#### 4. Middleware Issues
- Check middleware configuration
- Verify @supabase/ssr is installed
- Check route matching patterns

### Debug Tips
1. Check browser developer tools for network requests
2. Review Supabase dashboard for auth logs
3. Use console.log in auth context for debugging
4. Verify database row level security in Supabase

## 📚 Next Steps

### Recommended Enhancements
1. **Email Verification**: Add email confirmation flow
2. **Password Reset**: Implement forgot password functionality
3. **Profile Management**: User profile editing page
4. **Social Auth**: Add Google/GitHub login options
5. **Remember Me**: Persistent login option
6. **Admin Panel**: User management for admins

### Performance Optimizations
1. **Session Caching**: Implement session caching
2. **API Caching**: Add request caching for better performance
3. **Loading States**: Enhance loading indicators
4. **Error Boundaries**: Add error boundary components

This completes the authentication setup! Your Ideas App now has secure user authentication with proper data isolation.