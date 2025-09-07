import { describe, it, expect } from 'vitest';

import { createLinkSchema } from '../validation';

describe('createLinkSchema', () => {
  describe('originalUrl validation', () => {
    it('should pass with valid https URL', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'example',
      });

      expect(result.success).toBe(true);
    });

    it('should pass with valid http URL', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'http://example.com',
        customShortUrl: 'example',
      });

      expect(result.success).toBe(true);
    });

    it('should fail with empty URL', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: '',
        customShortUrl: 'example',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('URL é obrigatória');
      }
    });

    it('should fail with invalid URL format', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'not-a-url',
        customShortUrl: 'example',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Por favor, insira uma URL válida com http:// ou https://'
        );
      }
    });

    it('should fail with URL without protocol', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'example.com',
        customShortUrl: 'example',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Por favor, insira uma URL válida com http:// ou https://'
        );
      }
    });

    it('should fail with ftp URL', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'ftp://example.com',
        customShortUrl: 'example',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Por favor, insira uma URL válida com http:// ou https://'
        );
      }
    });
  });

  describe('customShortUrl validation', () => {
    it('should pass with valid custom short URL', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'example123',
      });

      expect(result.success).toBe(true);
    });

    it('should pass with custom short URL containing hyphens and underscores', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'example-123_test',
      });

      expect(result.success).toBe(true);
    });

    it('should fail with empty custom short URL', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Informe uma URL minúscula e sem espaço/caracteres especiais'
        );
      }
    });

    it('should fail with custom short URL containing spaces', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'example 123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'URL personalizada pode conter apenas letras, números, hífens e sublinhados'
        );
      }
    });

    it('should fail with custom short URL containing special characters', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'example@123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'URL personalizada pode conter apenas letras, números, hífens e sublinhados'
        );
      }
    });

    it('should fail with custom short URL too short', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'ab',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'URL personalizada deve ter entre 3 e 20 caracteres'
        );
      }
    });

    it('should fail with custom short URL too long', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'this-is-a-very-long-custom-url-that-exceeds-the-limit',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'URL personalizada deve ter entre 3 e 20 caracteres'
        );
      }
    });

    it('should pass with custom short URL at minimum length', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'abc',
      });

      expect(result.success).toBe(true);
    });

    it('should pass with custom short URL at maximum length', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'this-is-exactly-20',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('combined validation', () => {
    it('should pass with both valid original URL and custom short URL', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'https://example.com',
        customShortUrl: 'example',
      });

      expect(result.success).toBe(true);
    });

    it('should fail with both invalid original URL and custom short URL', () => {
      const result = createLinkSchema.safeParse({
        originalUrl: 'invalid-url',
        customShortUrl: 'ab',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
        expect(result.error.issues[0].message).toBe(
          'Por favor, insira uma URL válida com http:// ou https://'
        );
        expect(result.error.issues[1].message).toBe(
          'URL personalizada deve ter entre 3 e 20 caracteres'
        );
      }
    });
  });
});
