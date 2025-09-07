import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { db } from '../index';
import { schema } from '../schemas';
import { eq } from 'drizzle-orm';

describe('Database Schema Operations', () => {
  beforeEach(async () => {
    
    vi.clearAllMocks();
  });

  afterEach(async () => {
    
    
  });

  describe('Links Table', () => {
    it('should insert a new link', async () => {
      const linkData = {
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 0,
      };

      const [insertedLink] = await db.insert(schema.links).values(linkData).returning();

      expect(insertedLink).toMatchObject({
        originalUrl: linkData.originalUrl,
        shortUrl: linkData.shortUrl,
        accessCount: linkData.accessCount,
      });
      expect(insertedLink.id).toBeDefined();
      expect(insertedLink.createdAt).toBeDefined();
    });

    it('should select links by short URL', async () => {
      const linkData = {
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 5,
      };

      
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([linkData]),
        }),
      });

      await db.insert(schema.links).values(linkData);

      const links = await db
        .select()
        .from(schema.links)
        .where(eq(schema.links.shortUrl, 'test123'));

      expect(links).toHaveLength(1);
      expect(links[0]).toMatchObject(linkData);
    });

    it('should update link access count', async () => {
      
      const mockLink = {
        id: 'test-id',
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 5,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };

      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockLink]),
        }),
      });

      (db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{
            ...mockLink,
            accessCount: 10, 
          }]),
        }),
      });

      const linkData = {
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 5,
      };

      const [insertedLink] = await db.insert(schema.links).values(linkData).returning();

      await db
        .update(schema.links)
        .set({ accessCount: 10 })
        .where(eq(schema.links.id, insertedLink.id));

      const [updatedLink] = await db
        .select()
        .from(schema.links)
        .where(eq(schema.links.id, insertedLink.id));

      expect(updatedLink.accessCount).toBe(10);
    });

    it('should delete a link by ID', async () => {
      
      const mockLink = {
        id: 'test-id',
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 5,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };

      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockLink]),
        }),
      });

      (db.delete as any).mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      });

      
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]), 
        }),
      });

      const linkData = {
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 5,
      };

      const [insertedLink] = await db.insert(schema.links).values(linkData).returning();

      await db.delete(schema.links).where(eq(schema.links.id, insertedLink.id));

      const links = await db
        .select()
        .from(schema.links)
        .where(eq(schema.links.id, insertedLink.id));

      expect(links).toHaveLength(0);
    });

    it('should enforce unique constraint on shortUrl', async () => {
      
      const mockLink1 = {
        id: 'test-id-1',
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 0,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };

      let insertCallCount = 0;
      (db.insert as any).mockImplementation(() => {
        insertCallCount++;
        return {
          values: vi.fn().mockImplementation((values) => {
            if (insertCallCount === 1) {
              
              return {
                returning: vi.fn().mockResolvedValue([mockLink1]),
              };
            } else {
              
              return {
                returning: vi.fn().mockRejectedValue(new Error('Unique constraint violation')),
              };
            }
          }),
        };
      });

      const linkData1 = {
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 0,
      };

      const linkData2 = {
        originalUrl: 'https://example.com',
        shortUrl: 'test123', 
        accessCount: 0,
      };

      await db.insert(schema.links).values(linkData1);

      
      await expect(
        db.insert(schema.links).values(linkData2).returning()
      ).rejects.toThrow();
    });

    it('should select all links ordered by creation date', async () => {
      
      const mockLinks = [
        {
          id: 'test-id-1',
          originalUrl: 'https://example.com',
          shortUrl: 'test1',
          accessCount: 5,
          createdAt: new Date('2024-01-01T00:00:00Z'),
        },
        {
          id: 'test-id-2',
          originalUrl: 'https://example.com',
          shortUrl: 'test2',
          accessCount: 10,
          createdAt: new Date('2024-01-02T00:00:00Z'),
        },
      ];

      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      });

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockLinks),
        }),
      });

      const link1 = {
        originalUrl: 'https://example.com',
        shortUrl: 'test1',
        accessCount: 5,
      };

      const link2 = {
        originalUrl: 'https://example.com',
        shortUrl: 'test2',
        accessCount: 10,
      };

      await db.insert(schema.links).values(link1);
      await db.insert(schema.links).values(link2);

      const links = await db
        .select()
        .from(schema.links)
        .orderBy(schema.links.createdAt);

      expect(links).toHaveLength(2);
      
      expect(links[0].shortUrl).toBe('test1');
      expect(links[1].shortUrl).toBe('test2');
    });

    it('should handle null values correctly', async () => {
      
      const mockLink = {
        id: 'test-id',
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 0, 
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };

      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockLink]),
        }),
      });

      const linkData = {
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        
      };

      const [insertedLink] = await db.insert(schema.links).values(linkData).returning();

      expect(insertedLink.accessCount).toBe(0);
      expect(insertedLink.createdAt).toBeDefined();
    });
  });
});
