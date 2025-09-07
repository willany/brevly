import { z } from 'zod';

export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL é obrigatória')
    .refine(url => {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      } catch {
        return false;
      }
    }, 'Por favor, insira uma URL válida com http:// ou https://'),
  customShortUrl: z
    .string()
    .min(1, 'Informe uma URL minúscula e sem espaço/caracteres especiais')
    .refine(value => {
      if (!value) return true;
      return /^[a-zA-Z0-9-_]+$/.test(value);
    }, 'URL personalizada pode conter apenas letras, números, hífens e sublinhados')
    .refine(value => {
      if (!value) return true;
      return value.length >= 3 && value.length <= 20;
    }, 'URL personalizada deve ter entre 3 e 20 caracteres'),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
