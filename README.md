# Brevly - URL Shortener Platform

A modern, full-stack URL shortening platform built with React, Fastify, TypeScript, and PostgreSQL. Features include custom short URLs, analytics tracking, CSV export, and a beautiful responsive interface.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### 1. Start the Backend

```bash
cd server
docker-compose up -d
```

The API will be available at:
- **API**: http://localhost:3333
- **Documentation**: http://localhost:3333/docs
- **Health Check**: http://localhost:3333/health

### 2. Start the Frontend

```bash
cd web
npm install
npm run dev
```

The frontend will be available at:
- **Web App**: http://localhost:5173

## ✨ Features

### Core Functionality

- 🔗 **Custom Short URLs**: Create memorable short links
- 📊 **Analytics**: Track click counts and access statistics
- 📁 **CSV Export**: Export link data for analysis
- 🗑️ **Link Management**: Delete and manage your links
- 🔄 **Real-time Updates**: Live data synchronization
- 📱 **Responsive Design**: Works on all devices

### Technical Features

- 🐳 **Docker Support**: Full containerization
- 🌐 **CORS Enabled**: Cross-origin resource sharing
- 📚 **API Documentation**: Interactive Swagger UI
- ✅ **Health Monitoring**: Built-in health checks
- 🧪 **Comprehensive Testing**: Full test coverage
- 🎨 **Modern UI**: Beautiful, responsive interface

## 🏗️ Architecture

```
brevly/
├── web/                    # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── pages/          # Page components
│   │   └── styles/         # CSS modules
│   └── README.md
├── server/                 # Fastify backend
│   ├── src/
│   │   ├── infra/          # Infrastructure (DB, HTTP)
│   │   ├── services/       # Business logic
│   │   └── test/           # Test utilities
│   ├── docker-compose.yml  # Docker orchestration
│   └── README.md
└── README.md              # This file
```

## 🛠️ Tech Stack

### Frontend (Web)
- **Framework**: React 19 with TypeScript
- **Bundler**: Vite
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod
- **Code Quality**: ESLint + Prettier

### Backend (Server)
- **Runtime**: Node.js 22 with TypeScript
- **Framework**: Fastify with Zod validation
- **Database**: PostgreSQL with Drizzle ORM
- **Documentation**: OpenAPI/Swagger UI
- **Testing**: Vitest
- **Containerization**: Docker + Docker Compose

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/docs` | API documentation |
| `POST` | `/links` | Create short URL |
| `GET` | `/links` | Get all links |
| `DELETE` | `/links/:shortUrl` | Delete link |
| `GET` | `/:shortUrl` | Redirect to original URL |
| `GET` | `/links/export` | Export links to CSV |

## 🗄️ Database Schema

```sql
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url TEXT NOT NULL,
  short_url TEXT NOT NULL UNIQUE,
  access_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## 🚀 Development

### Backend Development

```bash
cd server
npm install
npm run dev
```

### Frontend Development

```bash
cd web
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
cd server
npm run test

# Frontend tests
cd web
npm run test
```

## 🐳 Docker Deployment

### Full Stack with Docker Compose

```bash
# Start backend
cd server
docker-compose up -d

# Start frontend (in another terminal)
cd web
npm run dev
```

### Services

- **Backend API**: http://localhost:3333
- **Frontend App**: http://localhost:5173
- **PostgreSQL**: Internal database
- **API Docs**: http://localhost:3333/docs

## 📖 Documentation

- **Frontend**: [web/README.md](./web/README.md)
- **Backend**: [server/README.md](./server/README.md)
- **API Docs**: http://localhost:3333/docs (when running)

## 🧪 Testing

The project includes comprehensive testing:

- **Backend**: Vitest with database mocking
- **Frontend**: React Testing Library
- **Coverage**: Full test coverage for critical paths
- **Integration**: End-to-end API testing

## 🔧 Configuration

### Environment Variables

#### Backend (.env in server/)
```env
PORT=3333
POSTGRES_HOST=db
POSTGRES_USER=docker
POSTGRES_PASSWORD=docker
POSTGRES_DB=brevly
```

#### Frontend (.env in web/)
```env
VITE_BACKEND_URL=http://localhost:3333
VITE_FRONTEND_URL=http://localhost:5173
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#2C46B1`
- **Secondary Blue**: `#2C4091`
- **Neutral Grays**: `#F9F9FB`, `#E4E6EC`, `#CDCFD5`, `#74798B`, `#4D505C`, `#1F2025`
- **Danger**: `#B12C4D`

### Typography
- **Font Family**: Open Sans
- **Text Sizes**: XL (24px), LG (18px), MD (14px), SM (12px), XS (10px)

## 📊 Features Overview

### ✅ Implemented Features

- [x] **URL Shortening** with custom short URLs
- [x] **Analytics Tracking** with click counts
- [x] **CSV Export** for data analysis
- [x] **Link Management** (create, read, delete)
- [x] **Real-time Updates** with React Query
- [x] **Responsive Design** for all devices
- [x] **API Documentation** with Swagger UI
- [x] **Docker Support** with Docker Compose
- [x] **CORS Configuration** for web clients
- [x] **Health Monitoring** with health checks
- [x] **Comprehensive Testing** with full coverage
- [x] **Code Quality** with ESLint and Prettier

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd brevly
   ```

2. **Start the backend**:
   ```bash
   cd server
   docker-compose up -d
   ```

3. **Start the frontend**:
   ```bash
   cd web
   npm install
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3333
   - API Documentation: http://localhost:3333/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Check the API documentation at http://localhost:3333/docs
- Review the individual README files in `web/` and `server/` directories
- Open an issue on GitHub

---

**Brevly** - Making long URLs short and memorable! 🔗✨
