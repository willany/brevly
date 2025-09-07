import { API_ENDPOINTS } from '../config/api';
import { apiClient } from '../utils/axios';

export const incrementAccessCount = async (shortUrl: string): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.LINKS.ACCESS(shortUrl));
};
