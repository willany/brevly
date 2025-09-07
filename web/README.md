# Brevly - URL Shortener

A modern, responsive React application for creating and managing shortened URLs with analytics and export capabilities. Built with Vite, TypeScript, and a comprehensive design system.

## ✨ Features

### Core Functionality

- [x] **Create shortened links** with custom short URLs
- [x] **Delete links** with confirmation
- [x] **Redirect handling** with auto-redirect and manual fallback
- [x] **Link management** with real-time updates
- [x] **Access tracking** with click analytics
- [x] **CSV export** for data analysis
- [x] **Responsive design** for all devices
- [x] **CORS enabled** for cross-origin requests
- [x] **API documentation** with Swagger UI

### Advanced Features

- [x] **Real-time updates** with React Query
- [x] **Form validation** with Zod schemas
- [x] **Loading states** with custom animations
- [x] **Error handling** with user-friendly messages
- [x] **Empty states** with helpful guidance
- [x] **Custom scrollbars** with brand colors
- [x] **Service architecture** for maintainability

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Bundler**: Vite
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod validation
- **Code Quality**: ESLint + Prettier
- **Icons**: PNG and SVG assets
- **Font**: Open Sans (Google Fonts)

## Design System

### Colors

- **Blue Base**: `#2C46B1`
- **Blue Dark**: `#2C4091`
- **White**: `#FFFFFF`
- **Gray Scale**: `#F9F9FB`, `#E4E6EC`, `#CDCFD5`, `#74798B`, `#4D505C`, `#1F2025`
- **Danger**: `#B12C4D`

### Typography

- **Font Family**: Open Sans
- **Text Sizes**: XL (24px), LG (18px), MD (14px), SM (12px), XS (10px)

## Pages

1. **Home Page (`/`)**: Link creation form and links list
2. **Redirect Page (`/:shortUrl`)**: Handles short URL redirections
3. **404 Page (`*`)**: Not found page for invalid routes

## 🚀 Quick Start

1. **Clone and install**:

   ```bash
   git clone <repository-url>
   cd brevly/web
   npm install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   # VITE_BACKEND_URL should be http://localhost:3333 for Docker Compose setup
   ```

3. **Start the backend server** (in server directory):
   ```bash
   cd ../server
   docker-compose up -d
   ```

4. **Start development** (in web directory):
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

## ⚙️ Environment Variables

Create a `.env` file in the web directory:

```env
# Frontend URL (usually localhost:5173)
VITE_FRONTEND_URL=http://localhost:5173

# Backend API URL (Docker Compose maps port 3000 to internal 3333)
VITE_BACKEND_URL=http://localhost:3333
```

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see server README)

### Setup Steps

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   # VITE_BACKEND_URL should be http://localhost:3333 for Docker Compose setup
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx & Button.module.css
│   ├── IconButton.tsx & IconButton.module.css
│   ├── Input.tsx & Input.module.css
│   ├── PrefixInput.tsx & PrefixInput.module.css
│   ├── LinkCard.tsx & LinkCard.module.css
│   ├── LinkForm.tsx & LinkForm.module.css
│   └── LinksList.tsx & LinksList.module.css
├── hooks/              # Custom React hooks (separated by concern)
│   ├── useLinks.ts
│   ├── useCreateLink.ts
│   ├── useDeleteLink.ts
│   ├── useDownloadCSV.ts
│   └── index.ts
├── services/           # API service functions
│   ├── linkService.ts
│   ├── exportService.ts
│   ├── analyticsService.ts
│   └── index.ts
├── pages/              # Page components
│   ├── Home.tsx & Home.module.css
│   ├── Redirect.tsx & Redirect.module.css
│   └── NotFound.tsx & NotFound.module.css
├── config/             # Configuration files
│   └── api.ts
├── styles/             # Global styles and design system
│   ├── variables.module.css
│   └── global.module.css
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── axios.ts        # Axios configuration
│   └── validation.ts   # Zod schemas
├── assets/             # Static assets
│   ├── Logo.svg
│   ├── Logo_Icon.svg
│   └── *.png (icons)
├── App.tsx
└── main.tsx
```

## 🔌 API Integration

The application uses a service-based architecture with Axios for HTTP requests:

### Service Architecture

- **`linkService.ts`** - Link CRUD operations
- **`exportService.ts`** - CSV export functionality
- **`analyticsService.ts`** - Access tracking
- **`axios.ts`** - HTTP client configuration with interceptors

### API Endpoints

- `POST /links` - Create a new link
- `GET /links` - Get all links
- `DELETE /links/:shortUrl` - Delete a link
- `GET /:shortUrl` - Redirect to original URL
- `GET /links/export` - Download CSV report
- `GET /health` - Health check
- `GET /docs` - API documentation (Swagger UI)

### HTTP Client Features

- **Request/Response interceptors** for logging and error handling
- **TypeScript support** with full type safety
- **Environment-based configuration**

## 🚀 Features Implemented

### ✅ Link Creation & Management

- **Smart form validation** with Zod schemas
- **Custom short URL support** with prefix display
- **Real-time validation** with helpful error messages
- **Loading states** with custom animations
- **Duplicate URL handling** with user feedback

### ✅ Link Display & Interaction

- **Responsive link cards** with hover effects
- **One-click copy** to clipboard functionality
- **Delete confirmation** with smooth animations
- **Access count tracking** with real-time updates
- **Custom scrollbars** with brand colors

### ✅ Redirect System

- **Auto-redirect** after 3 seconds
- **Manual fallback** button for immediate redirect
- **Loading states** with branded animations
- **Error handling** for invalid short URLs
- **Access count increment** on each redirect

### ✅ Data Management & Performance

- **React Query** for efficient server state management
- **Background refetching** when returning to page
- **Basic retry logic** for failed requests
- **Service-based architecture** for maintainability

### ✅ User Experience & Design

- **Mobile-first responsive design** for all screen sizes
- **Loading spinners** with custom animations
- **Empty states** with helpful guidance
- **Error handling** with user-friendly messages
- **Accessibility** with keyboard navigation support

### ✅ Export & Analytics

- **CSV export** with formatted data
- **Access count tracking** per link
- **Real-time updates** of analytics data
- **Download management** with proper file naming

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#2C46B1` (Blue Base)
- **Secondary Blue**: `#2C4091` (Blue Dark)
- **Neutral Grays**: `#F9F9FB`, `#E4E6EC`, `#CDCFD5`, `#74798B`, `#4D505C`, `#1F2025`
- **Status Colors**: `#B12C4D` (Danger), `#FFFFFF` (White)

### Typography

- **Font Family**: Open Sans (Google Fonts)
- **Text Sizes**: XL (24px), LG (18px), MD (14px), SM (12px), XS (10px)
- **Font Weights**: 300, 400, 600, 700, 800

### Components

- **Custom scrollbars** with 4px width and brand colors
- **Loading animations** with multi-shadow spinner
- **Form inputs** with prefix support and validation states
- **Cards** with subtle shadows and rounded corners
- **Buttons** with hover states and loading indicators

## 🛠️ Development Notes

### Architecture Principles

- **Service-based architecture** for better maintainability
- **Separation of concerns** with dedicated hook files
- **TypeScript first** with full type safety
- **Mobile-first responsive design**
- **CSS Modules** for scoped styling

### Performance Optimizations

- **React Query** for efficient data fetching and caching
- **Background refetching** for data freshness
- **Custom scrollbars** for better performance

### Accessibility Features

- **Semantic HTML** structure
- **Keyboard navigation** support
- **Screen reader** friendly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
