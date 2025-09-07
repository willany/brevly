# API Configuration

This directory contains the API configuration and utilities for the web application.

## Files

### `api.ts`

Main API client that provides methods for interacting with the backend API. Uses axios under the hood.

### `axios.ts`

Axios configuration with interceptors for request/response handling, error management, and logging.

### `../config/api.ts`

API configuration constants including base URL, timeouts, endpoints, and environment settings.

## Usage

```typescript
import { api } from '../utils/api';

const newLink = await api.createLink({
  originalUrl: 'https://example.com',
  customShortUrl: 'example',
});

const links = await api.getLinks();

await api.deleteLink('link-id');
```

## Configuration

The API client is configured with:

- Base URL from environment variable `VITE_BACKEND_URL` (defaults to `http://localhost:3333`)
- 10-second timeout
- JSON content type headers
- Request/response interceptors for logging and error handling
- Development-only console logging

## Error Handling

All API methods throw errors that can be caught and handled:

- Network errors
- HTTP status errors
- Validation errors
- Timeout errors

## Environment Variables

- `VITE_BACKEND_URL`: Backend API base URL (default: `http://localhost:3333`)
