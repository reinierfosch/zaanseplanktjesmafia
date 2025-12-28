# De Zaanse Plankjes Maffia

A modern web application showcasing handcrafted art on wooden planks. Built with React, TypeScript, Express, and Vite.

## Overview

De Zaanse Plankjes Maffia is an art gallery website featuring:
- **Art Gallery**: Browse and purchase unique handcrafted artworks on wooden planks
- **Workshops**: Sign up for art workshops at different skill levels
- **Newsletter**: Subscribe to receive updates about new artworks and exclusive offers
- **Contact**: Get in touch with the team

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Validation**: React Hook Form + Zod
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ 
- pnpm 10+

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/reinierfosch/zaanseplanktjesmafia.git
cd zaanseplanktjesmafia
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

```env
# Google Maps API Configuration (Required for Map component)
VITE_FRONTEND_FORGE_API_KEY=your_google_maps_api_key_here
VITE_FRONTEND_FORGE_API_URL=https://forge.butterfly-effect.dev

# OAuth Configuration (Required for authentication)
VITE_OAUTH_PORTAL_URL=https://oauth.example.com
VITE_APP_ID=your_app_id_here

# Analytics Configuration (Optional)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration (Optional, for production)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 4. Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

Build the application:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── tabs/      # Tab components (HomeTab, GalleryTab, etc.)
│   │   │   └── ui/        # UI component library
│   │   ├── data/          # Static data (artworks, workshops)
│   │   ├── lib/           # Utilities and helpers
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   └── contexts/      # React contexts
│   └── public/            # Static assets
├── server/                 # Backend Express server
│   └── index.ts           # Server entry point
├── shared/                 # Shared code between client and server
└── patches/                # Dependency patches
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Newsletter
- `POST /api/newsletter` - Subscribe to newsletter
  - Body: `{ email: string, name?: string }`
  - Rate limited: 5 requests per 15 minutes

### Contact
- `POST /api/contact` - Submit contact form
  - Body: `{ name: string, email: string, message: string, subject?: string }`
  - Rate limited: 5 requests per 15 minutes

## Features

### ✅ Implemented

- [x] Environment variable validation
- [x] Component-based architecture
- [x] Form validation with react-hook-form + zod
- [x] Error handling for API calls and images
- [x] Image lazy loading and error handling
- [x] Loading states and skeleton screens
- [x] Accessibility improvements (ARIA attributes, semantic HTML)
- [x] Backend API endpoints with rate limiting
- [x] CORS configuration
- [x] Health check endpoint

### 🚧 Future Enhancements

- [ ] Database integration for storing subscriptions and contacts
- [ ] Email service integration (SendGrid, Resend, etc.)
- [ ] Shopping cart functionality
- [ ] Payment processing
- [ ] Workshop booking system
- [ ] Admin dashboard
- [ ] Image optimization service/CDN
- [ ] SEO improvements (meta tags, structured data)
- [ ] Comprehensive testing suite

## Development Workflow

### Code Quality

- TypeScript for type safety
- Prettier for code formatting
- ESLint for code linting (if configured)

### Format Code

```bash
pnpm format
```

### Type Checking

```bash
pnpm check
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FRONTEND_FORGE_API_KEY` | Yes | Google Maps API key |
| `VITE_FRONTEND_FORGE_API_URL` | No | Forge API base URL (default: https://forge.butterfly-effect.dev) |
| `VITE_OAUTH_PORTAL_URL` | Yes | OAuth portal URL for authentication |
| `VITE_APP_ID` | Yes | Application ID for OAuth |
| `VITE_ANALYTICS_ENDPOINT` | No | Analytics endpoint URL |
| `VITE_ANALYTICS_WEBSITE_ID` | No | Analytics website ID |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment (development/production) |
| `ALLOWED_ORIGINS` | No | Comma-separated list of allowed CORS origins |

## Troubleshooting

### Environment Variables Not Loading

Make sure your `.env` file is in the root directory and variables are prefixed with `VITE_` for client-side access.

### API Endpoints Not Working

1. Check that the server is running
2. Verify CORS configuration if accessing from a different origin
3. Check rate limiting - you may have exceeded the limit

### Images Not Loading

1. Verify images exist in `client/public/images/`
2. Check browser console for 404 errors
3. Ensure image paths are correct in the data files

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Contact

- Email: info@plankjesmaffia.nl
- Location: Zaandam, Nederland

---

Built with ❤️ by the Zaanse Plankjes Maffia team

