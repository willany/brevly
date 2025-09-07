import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CsvExportService, type LinkStats } from '../csvExport';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(),
  PutObjectCommand: vi.fn(),
}));

vi.mock('crypto', () => ({
  randomBytes: vi.fn(() => ({
    toString: vi.fn(() => 'abcd1234'),
  })),
}));

describe('CsvExportService', () => {
  let csvExportService: CsvExportService;
  let mockS3Client: any;

  beforeEach(() => {
    mockS3Client = {
      send: vi.fn(),
    };
    (S3Client as any).mockImplementation(() => mockS3Client);
    csvExportService = new CsvExportService();
  });

  describe('generateUniqueFileName', () => {
    it('should generate unique filename with timestamp and random suffix', () => {
      const fileName = (csvExportService as any).generateUniqueFileName();
      
      expect(fileName).toMatch(/^links-export-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z-abcd1234\.csv$/);
    });
  });

  describe('generateCsvContent', () => {
    it('should generate CSV content with headers and data', () => {
      const mockLinks: LinkStats[] = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          shortUrl: 'abc123',
          accessCount: 5,
          createdAt: new Date('2024-01-01T00:00:00Z'),
        },
        {
          id: '2',
          originalUrl: 'https://google.com',
          shortUrl: 'def456',
          accessCount: 10,
          createdAt: new Date('2024-01-02T00:00:00Z'),
        },
      ];

      const csvContent = (csvExportService as any).generateCsvContent(mockLinks);

      const expectedCsv = '"URL Original","URL Encurtada","Contagem de Acessos","Data de Criação"\n"https://example.com","abc123","5","2024-01-01T00:00:00.000Z"\n"https://google.com","def456","10","2024-01-02T00:00:00.000Z"';

      expect(csvContent).toBe(expectedCsv);
    });

    it('should handle empty links array', () => {
      const csvContent = (csvExportService as any).generateCsvContent([]);

      const expectedCsv = '"URL Original","URL Encurtada","Contagem de Acessos","Data de Criação"';

      expect(csvContent).toBe(expectedCsv);
    });

    it('should escape quotes in data', () => {
      const mockLinks: LinkStats[] = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          shortUrl: 'abc"123',
          accessCount: 5,
          createdAt: new Date('2024-01-01T00:00:00Z'),
        },
      ];

      const csvContent = (csvExportService as any).generateCsvContent(mockLinks);

      expect(csvContent).toContain('"https://example.com"');
      expect(csvContent).toContain('"abc""123"');
    });
  });

  describe('uploadToR2', () => {
    it('should upload content to R2 with correct parameters', async () => {
      const fileName = 'test-file.csv';
      const content = 'test,content';

      await (csvExportService as any).uploadToR2(fileName, content);

      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: process.env.CLOUDFLARE_BUCKET,
        Key: fileName,
        Body: content,
        ContentType: 'text/csv',
        CacheControl: 'public, max-age=3600',
      });

      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.any(PutObjectCommand)
      );
    });
  });

  describe('exportToCsv', () => {
    it('should export links to CSV and return file info', async () => {
      const mockLinks: LinkStats[] = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          shortUrl: 'abc123',
          accessCount: 5,
          createdAt: new Date('2024-01-01T00:00:00Z'),
        },
      ];

      const result = await csvExportService.exportToCsv(mockLinks);

      expect(result).toMatchObject({
        fileName: expect.stringMatching(/^links-export-.*\.csv$/),
        publicUrl: expect.stringMatching(/^.*\/links-export-.*\.csv$/),
      });
      expect(mockS3Client.send).toHaveBeenCalled();
    });

    it('should handle S3 upload errors', async () => {
      const mockLinks: LinkStats[] = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          shortUrl: 'abc123',
          accessCount: 5,
          createdAt: new Date('2024-01-01T00:00:00Z'),
        },
      ];

      mockS3Client.send.mockRejectedValue(new Error('S3 upload failed'));

      await expect(csvExportService.exportToCsv(mockLinks)).rejects.toThrow('S3 upload failed');
    });
  });
});
