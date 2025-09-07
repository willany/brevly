import { useMutation } from '@tanstack/react-query';

import { downloadCSV } from '../services';

export const useDownloadCSV = () => {
  return useMutation({
    mutationFn: downloadCSV,
    onSuccess: data => {
      const { fileName, publicUrl } = data;
      const url = publicUrl;
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
};
