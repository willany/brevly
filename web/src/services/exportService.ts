import { API_ENDPOINTS } from '../config/api';
import { apiClient } from '../utils/axios';

interface DownloadCSVResponse {
  fileName: string;
  publicUrl: string;
}

export const downloadCSV = async (): Promise<DownloadCSVResponse> => {
  const response = await apiClient.get<DownloadCSVResponse>(
    API_ENDPOINTS.LINKS.EXPORT
  );
  return response.data;
};
