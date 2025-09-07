import { API_ENDPOINTS } from '../config/api';
import type { CreateLinkRequest, CreateLinkResponse, Link } from '../types';
import { apiClient } from '../utils/axios';

export const createLink = async (
  data: CreateLinkRequest
): Promise<CreateLinkResponse> => {
  const response = await apiClient.post<CreateLinkResponse>(
    API_ENDPOINTS.LINKS.CREATE,
    data
  );
  return response.data;
};

export const getLinks = async (): Promise<Link[]> => {
  const response = await apiClient.get<Link[]>(API_ENDPOINTS.LINKS.LIST);
  return response.data;
};

export const deleteLink = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.LINKS.DELETE(id));
};

export const getOriginalUrl = async (
  shortUrl: string
): Promise<{ originalUrl: string }> => {
  const response = await apiClient.get<{ originalUrl: string }>(
    API_ENDPOINTS.LINKS.REDIRECT(shortUrl)
  );
  return response.data;
};
