# Turbodoc Web

A modern, responsive web application for bookmark management built with Next.js 15 and React 19. The web app provides a seamless experience for saving, organizing, and searching through your bookmarks with real-time synchronization across all your devices.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase project (for authentication and data storage)
- Cloudflare account (for deployment, optional)

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Configure your Supabase project:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

   Both values can be found in your [Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true).

### Development

Start the development server with Turbopack:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19 with Server Components
- **Build Tool**: Turbopack for fast development
- **Language**: TypeScript with strict mode
- **Authentication**: Supabase Auth with SSR support
- **Database**: Supabase (PostgreSQL) via REST API
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Server Components + Client Components
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode switching

### Project Structure

```txt
turbodoc-web/
├── app/                           # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   ├── confirm/
│   │   └── error/
│   ├── protected/                # Protected routes (requires auth)
│   │   └── dashboard/            # Main application dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── auth-button.tsx          # Authentication state button
│   ├── bookmark-card.tsx        # Individual bookmark display
│   ├── bookmark-grid.tsx        # Bookmark list layout
│   ├── drag-drop-zone.tsx       # File upload functionality
│   ├── login-form.tsx           # Sign in form
│   ├── sign-up-form.tsx         # Registration form
│   ├── forgot-password-form.tsx # Password reset form
│   ├── theme-switcher.tsx       # Dark/light mode toggle
│   └── logo.tsx                 # Application logo
├── lib/                         # Utilities and configurations
│   ├── supabase/               # Supabase client setup
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware
│   ├── api.ts                  # API integration layer
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions
├── middleware.ts               # Next.js middleware for auth
└── wrangler.jsonc             # Cloudflare Pages configuration
```

### Key Features

#### Authentication System

- **Email/Password**: Secure authentication with Supabase Auth
- **Server-Side Rendering**: Full SSR support with cookie-based sessions
- **Automatic Redirects**: Protected routes with middleware
- **Password Reset**: Email-based password recovery
- **Session Management**: Automatic token refresh and persistence

#### Bookmark Management

- **CRUD Operations**: Create, read, update, delete bookmarks
- **Real-time Sync**: Changes synchronized across all devices
- **Tag System**: Organize bookmarks with custom tags
- **Status Tracking**: Mark bookmarks as read/unread/archived
- **Search Functionality**: Filter bookmarks by title, URL, and tags
- **Bulk Actions**: Select and manage multiple bookmarks

#### User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: System-aware theme switching
- **Accessible**: WCAG 2.1 compliant components
- **Modern Design**: Clean, minimal interface with smooth animations
- **Loading States**: Proper loading indicators and skeleton screens

## 🎨 UI Components

### Design System

Built on **shadcn/ui** with customized components:

- **Button**: Various styles and sizes with loading states
- **Card**: Container component for bookmark display
- **Dialog**: Modal overlays for forms and confirmations
- **Form**: Validated forms with error handling
- **Input**: Text inputs with validation states
- **Badge**: Tag display with different variants

### Custom Components

- **BookmarkCard**: Individual bookmark with actions menu
- **BookmarkGrid**: Responsive grid layout for bookmarks
- **DragDropZone**: File upload area with drag and drop
- **ThemeSwitcher**: Toggle between light and dark modes
- **AuthButton**: Dynamic authentication state display

## 🔐 Authentication Flow

### SSR Authentication

The app uses Supabase Auth with Server-Side Rendering:

1. **Middleware**: Checks authentication on protected routes
2. **Server Components**: Access user session on server
3. **Client Hydration**: Seamless client-side state management
4. **Cookie Management**: Secure HTTP-only cookies for sessions

### Protected Routes

- `/protected/*`: Requires authenticated user
- Automatic redirects to `/auth/login` for unauthenticated users
- Post-login redirects back to intended destination

### Authentication Pages

- **Sign In** (`/auth/login`): Email and password authentication
- **Sign Up** (`/auth/sign-up`): User registration with email verification
- **Forgot Password** (`/auth/forgot-password`): Password reset flow
- **Confirmation** (`/auth/confirm`): Email verification landing
- **Error** (`/auth/error`): Authentication error handling

## 🌐 API Integration

### Backend Communication

The web app communicates with the Turbodoc API:

- **REST Endpoints**: Full CRUD operations for bookmarks
- **Authentication**: JWT bearer tokens for API access
- **Error Handling**: Consistent error responses and user feedback
- **Type Safety**: Shared TypeScript types with API

### Data Management

- **Server Components**: Fetch data on server for fast initial loads
- **Client Updates**: Optimistic updates with error rollback
- **Caching**: Strategic caching for performance
- **Synchronization**: Real-time updates across browser tabs

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run format` | Format code with Biome |

### Advanced Commands

| Command | Description |
|---------|-------------|
| `npm run pages:build` | Build for Cloudflare Pages |
| `npm run preview` | Build and preview with Wrangler |
| `npm run deploy` | Deploy to Cloudflare Pages |

## 🚀 Deployment

### Cloudflare Pages (Recommended)

1. **Build the application**:

   ```bash
   npm run pages:build
   ```

2. **Deploy to Cloudflare Pages**:

   ```bash
   npm run deploy
   ```

3. **Configure environment variables** in Cloudflare Pages dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Vercel Deployment

1. **Connect GitHub repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Self-Hosted

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Start production server**:

   ```bash
   npm run start
   ```

## 🔄 Integration

### Cross-Platform Synchronization

- **Shared Database**: Same Supabase backend as iOS app
- **Real-time Updates**: Changes sync across all platforms
- **Consistent API**: Uses Turbodoc REST API for all operations
- **Authentication**: Shared user accounts across platforms

### Third-Party Services

- **Supabase**: Authentication and database
- **Cloudflare**: CDN and edge computing
- **OpenGraph**: Automatic bookmark metadata fetching

## 🧪 Testing

### Development Testing

- **TypeScript**: Compile-time error checking
- **ESLint**: Code quality and consistency
- **Browser DevTools**: Client-side debugging
- **Network Tab**: API request monitoring

### User Testing

- **Responsive Design**: Test across device sizes
- **Authentication Flow**: Verify all auth scenarios
- **Bookmark Operations**: Test CRUD functionality
- **Cross-browser**: Verify compatibility

## ⚡ Performance

### Optimization Strategies

- **Server Components**: Reduce client-side JavaScript
- **Turbopack**: Fast development builds and hot reload
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-render pages where possible

### Monitoring

- **Lighthouse Scores**: Automated performance auditing
- **Core Web Vitals**: Monitor user experience metrics
- **Cloudflare Analytics**: Edge performance insights

## 🎨 Styling

### Tailwind CSS

- **Utility Classes**: Rapid styling with utility-first approach
- **Custom Design System**: Consistent spacing, colors, and typography
- **Responsive Design**: Mobile-first responsive utilities
- **Dark Mode**: Built-in dark mode support

### Component System

- **shadcn/ui**: High-quality, accessible base components
- **Custom Variants**: Extended components for specific use cases
- **Consistent Styling**: Design system with CSS variables
- **Animation**: Smooth transitions and micro-interactions

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile-First Approach

- Progressive enhancement from mobile base styles
- Touch-friendly interface elements
- Optimized navigation for small screens
- Fast loading on mobile networks

## 🔍 SEO & Accessibility

### SEO Optimization

- **Meta Tags**: Dynamic meta tags for each page
- **Structured Data**: Schema.org markup for rich snippets
- **Sitemap**: Automatic sitemap generation
- **Performance**: Fast loading for better search rankings

### Accessibility

- **WCAG 2.1**: AA compliance level
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: Sufficient contrast ratios

## 📚 Learn More

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Turbodoc Ecosystem

- [Turbodoc API Documentation](../turbodoc-api/README.md)
- [Turbodoc iOS Documentation](../turbodoc-ios/README.md)
- [Project Overview](../README.md)

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Consistent code formatting
- **Components**: Reusable, well-documented components
- **Accessibility**: Maintain WCAG compliance

## 🔒 Security

### Security Measures

- **HTTPS Only**: All communications encrypted
- **CSP Headers**: Content Security Policy implemented
- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Environment Variables**: Secure configuration management

### Best Practices

- **No Secrets in Client**: Environment variables properly scoped
- **Secure Headers**: Security headers configured
- **Input Validation**: All user inputs validated
- **Error Handling**: Secure error messages

---

**Turbodoc Web** - Your bookmarks, beautifully organized and accessible everywhere.
