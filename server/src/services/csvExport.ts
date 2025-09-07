import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';

export interface LinkStats {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
}

export interface CsvExportResult {
  fileName: string;
  publicUrl: string;
}

export class CsvExportService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      },
    });
  }

  async exportToCsv(links: LinkStats[]): Promise<CsvExportResult> {
    const fileName = this.generateUniqueFileName();
    const csvContent = this.generateCsvContent(links);

    await this.uploadToR2(fileName, csvContent);

    return {
      fileName,
      publicUrl: `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`,
    };
  }

  private generateUniqueFileName(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const randomSuffix = randomBytes(4).toString('hex');
    return `links-export-${timestamp}-${randomSuffix}.csv`;
  }

  private generateCsvContent(links: LinkStats[]): string {
    const headers = ['URL Original', 'URL Encurtada', 'Contagem de Acessos', 'Data de Criação'];
    const rows = links.map((link) => [
      link.originalUrl,
      link.shortUrl,
      link.accessCount.toString(),
      link.createdAt.toISOString(),
    ]);

    const csvRows = [headers, ...rows];
    return csvRows.map((row) => 
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  private async uploadToR2(fileName: string, content: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: fileName,
      Body: content,
      ContentType: 'text/csv',
      CacheControl: 'public, max-age=3600',
    });

    await this.s3Client.send(command);
  }
} 