import { describe, it, expect, vi, beforeEach } from 'vitest';

import { API_ENDPOINTS } from '../../config/api';
import type { CreateLinkRequest, CreateLinkResponse, Link } from '../../types';
import { apiClient } from '../../utils/axios';
import {
  createLink,
  getLinks,
  deleteLink,
  getOriginalUrl,
} from '../linkService';

vi.mock('../../utils/axios', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../config/api', () => ({
  API_ENDPOINTS: {
    LINKS: {
      CREATE: '/api/links',
      LIST: '/api/links',
      DELETE: (id: string) => `/api/links/${id}`,
      REDIRECT: (shortUrl: string) => `/api/links/${shortUrl}/redirect`,
    },
  },
}));

describe('linkService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createLink', () => {
    it('should create a link successfully', async () => {
      const mockRequest: CreateLinkRequest = {
        originalUrl: 'https://example.com',
        customShortUrl: 'example',
      };

      const mockResponse: CreateLinkResponse = {
        id: '1',
        originalUrl: 'https://example.com',
        shortUrl: 'example',
        prefix: 'example',
        createdAt: '2024-01-01T00:00:00Z',
        clickCount: 0,
      };

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await createLink(mockRequest);

      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.LINKS.CREATE,
        mockRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle create link error', async () => {
      const mockRequest: CreateLinkRequest = {
        originalUrl: 'https://example.com',
        customShortUrl: 'example',
      };

      const error = new Error('Network error');
      vi.mocked(apiClient.post).mockRejectedValue(error);

      await expect(createLink(mockRequest)).rejects.toThrow('Network error');
      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.LINKS.CREATE,
        mockRequest
      );
    });
  });

  describe('getLinks', () => {
    it('should fetch links successfully', async () => {
      const mockLinks: Link[] = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          shortUrl: 'example',
          prefix: 'example',
          createdAt: '2024-01-01T00:00:00Z',
          clickCount: 0,
        },
        {
          id: '2',
          originalUrl: 'https://google.com',
          shortUrl: 'google',
          prefix: 'google',
          createdAt: '2024-01-02T00:00:00Z',
          clickCount: 5,
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockLinks });

      const result = await getLinks();

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.LINKS.LIST);
      expect(result).toEqual(mockLinks);
    });

    it('should handle get links error', async () => {
      const error = new Error('Failed to fetch links');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(getLinks()).rejects.toThrow('Failed to fetch links');
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.LINKS.LIST);
    });
  });

  describe('deleteLink', () => {
    it('should delete a link successfully', async () => {
      const linkId = '1';
      vi.mocked(apiClient.delete).mockResolvedValue({ data: undefined });

      await deleteLink(linkId);

      expect(apiClient.delete).toHaveBeenCalledWith(
        API_ENDPOINTS.LINKS.DELETE(linkId)
      );
    });

    it('should handle delete link error', async () => {
      const linkId = '1';
      const error = new Error('Failed to delete link');
      vi.mocked(apiClient.delete).mockRejectedValue(error);

      await expect(deleteLink(linkId)).rejects.toThrow('Failed to delete link');
      expect(apiClient.delete).toHaveBeenCalledWith(
        API_ENDPOINTS.LINKS.DELETE(linkId)
      );
    });
  });

  describe('getOriginalUrl', () => {
    it('should get original URL successfully', async () => {
      const shortUrl = 'example';
      const mockResponse = { originalUrl: 'https://example.com' };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

      const result = await getOriginalUrl(shortUrl);

      expect(apiClient.get).toHaveBeenCalledWith(
        API_ENDPOINTS.LINKS.REDIRECT(shortUrl)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle get original URL error', async () => {
      const shortUrl = 'example';
      const error = new Error('Link not found');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(getOriginalUrl(shortUrl)).rejects.toThrow('Link not found');
      expect(apiClient.get).toHaveBeenCalledWith(
        API_ENDPOINTS.LINKS.REDIRECT(shortUrl)
      );
    });
  });
});
