# Brevly - URL Shortener API

A comprehensive URL shortening service built with Fastify, TypeScript, and PostgreSQL. Features include URL shortening, analytics tracking, and data export capabilities with full Docker Compose support.

## ✨ Features

- 🔗 **URL Shortening**: Create short URLs with custom short URLs
- 📊 **Analytics**: Track access counts and view statistics
- 📁 **Data Export**: Export link data to CSV format
- 🗑️ **Link Management**: Delete links by short URL
- 📚 **API Documentation**: Complete Swagger UI documentation
- 🐳 **Docker Support**: Full containerization with Docker Compose
- 🌐 **CORS Enabled**: Cross-origin resource sharing for web clients
- ✅ **Health Checks**: Built-in health monitoring

## 🛠️ Tech Stack

- **Runtime**: Node.js 22 with TypeScript
- **Framework**: Fastify with Zod validation
- **Database**: PostgreSQL with Drizzle ORM
- **Documentation**: OpenAPI/Swagger UI
- **CORS**: Cross-origin resource sharing enabled
- **Testing**: Vitest with comprehensive test coverage
- **Code Quality**: ESLint + Prettier
- **Containerization**: Docker + Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher) for local development

### Docker Compose (Recommended)

1. **Clone the repository**:
```bash
git clone <repository-url>
cd brevly/server
```

2. **Start the services**:
```bash
docker-compose up -d
```

3. **Access the API**:
- **API**: http://localhost:3000
- **Documentation**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

### Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start PostgreSQL** (if not using Docker):
```bash
# Start PostgreSQL locally or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=brevly -p 5432:5432 -d postgres:15
```

4. **Run database migrations**:
```bash
npm run db:migrate
```

5. **Start the development server**:
```bash
npm run dev
```

The server will start on `http://localhost:3333`

## 📚 API Documentation

### Interactive Documentation

Once the server is running, you can access the interactive API documentation at:

**Docker Compose**: http://localhost:3000/docs  
**Local Development**: http://localhost:3333/docs

This provides a complete Swagger UI interface where you can:
- Explore all available endpoints
- Test API calls directly from the browser
- View request/response schemas
- See example requests and responses

### API Endpoints

#### 1. Create Short URL
- **POST** `/links`
- **Description**: Create a new shortened URL with optional custom short URL
- **Body**:
  ```json
  {
    "originalUrl": "https://www.example.com/very-long-url-that-needs-shortening",
    "customShortUrl": "my-custom-link"
  }
  ```
- **Response**:
  ```json
  {
    "id": "019925a8-af25-7342-8531-fb1b22931648",
    "originalUrl": "https://www.example.com/very-long-url-that-needs-shortening",
    "shortUrl": "my-custom-link",
    "accessCount": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
  ```

#### 2. Redirect to Original URL
- **GET** `/{shortUrl}`
- **Description**: Redirect to the original URL using the short URL
- **Response**: 302 redirect to original URL

#### 3. Get All Links
- **GET** `/links`
- **Description**: Retrieve all shortened URLs with their statistics
- **Response**:
  ```json
  [
    {
      "id": "019925a8-af25-7342-8531-fb1b22931648",
      "originalUrl": "https://www.example.com/very-long-url-that-needs-shortening",
      "shortUrl": "my-custom-link",
      "accessCount": 42,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
  ```

#### 4. Delete Link
- **DELETE** `/links/{shortUrl}`
- **Description**: Delete a shortened URL by its short URL
- **Response**: 200 OK with success message

#### 5. Export Links to CSV
- **GET** `/links/export`
- **Description**: Export all links data to CSV format
- **Response**:
  ```json
  {
    "csvData": "id,original_url,short_url,access_count,created_at\n019925a8-af25-7342-8531-fb1b22931648,https://example.com,abc123,5,2024-01-15T10:30:00Z",
    "filename": "links_export_20240115.csv",
    "recordCount": 10
  }
  ```

#### 6. Health Check
- **GET** `/health`
- **Description**: Check if the API is running
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "error": "originalUrl is required"
}
```

### 404 Not Found
```json
{
  "error": "Short URL not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

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

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run test suite
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate new migration files
- `npm run db:studio` - Open Drizzle Studio for database management

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3333
NODE_ENV=production

# Database Configuration
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=docker
POSTGRES_PASSWORD=docker
POSTGRES_DB=brevly

# Cloudflare R2 (Optional - for CSV export)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET=brevly
CLOUDFLARE_PUBLIC_URL=your_public_url
```

## 🐳 Docker Deployment

### Docker Compose (Recommended)

The project includes a complete `docker-compose.yml` for easy deployment:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services

- **API Server**: http://localhost:3000 (mapped from internal 3333)
- **PostgreSQL**: Internal database on port 5432
- **API Documentation**: http://localhost:3000/docs

### Environment Configuration

The Docker Compose setup uses the following environment variables:

```env
# Server
PORT=3333
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=docker
POSTGRES_PASSWORD=docker
POSTGRES_DB=brevly

# Cloudflare R2 (for CSV export)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET=brevly
CLOUDFLARE_PUBLIC_URL=your_public_url
```

## 🧪 API Testing

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Create a short URL
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.example.com/very-long-url", "customShortUrl": "my-link"}'

# Get all links
curl http://localhost:3000/links

# Export to CSV
curl http://localhost:3000/links/export

# Delete a link
curl -X DELETE http://localhost:3000/links/my-link
```

### Using the Swagger UI

1. Open http://localhost:3000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in the required parameters
5. Click "Execute"

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For API support and questions, please refer to the interactive documentation at `/documentation` or contact support@urlshortener.com 