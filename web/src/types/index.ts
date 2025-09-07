export interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  accessCount: number;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customShortUrl?: string;
}

export interface CreateLinkResponse {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  accessCount: number;
}

export interface FormErrors {
  [key: string]: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateLinkFormData {
  originalUrl: string;
  customShortUrl?: string;
}
