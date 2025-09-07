import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

process.env.POSTGRES_USER = 'test_user';
process.env.POSTGRES_PASSWORD = 'test_password';
process.env.POSTGRES_DB = 'test_brevly';
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_PORT = '5432';
process.env.CLOUDFLARE_ACCOUNT_ID = 'test_account_id';
process.env.CLOUDFLARE_ACCESS_KEY_ID = 'test_access_key';
process.env.CLOUDFLARE_SECRET_ACCESS_KEY = 'test_secret_key';
process.env.CLOUDFLARE_BUCKET = 'test_bucket';
process.env.CLOUDFLARE_PUBLIC_URL = 'https://test.example.com';

vi.mock('../infra/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{
      id: 'test-id',
      originalUrl: 'https://example.com',
      shortUrl: 'test123',
      accessCount: 0,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  },
}));

beforeAll(async () => {
});

afterAll(async () => {
});

beforeEach(async () => {
});
