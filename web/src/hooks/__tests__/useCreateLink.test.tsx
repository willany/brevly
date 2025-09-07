import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as services from '../../services';
import { useCreateLink } from '../useCreateLink';

vi.mock('../../services', () => ({
  createLink: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCreateLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a link successfully', async () => {
    const mockLink = {
      id: '1',
      originalUrl: 'https://example.com',
      shortUrl: 'abc123',
    };
    vi.mocked(services.createLink).mockResolvedValue(mockLink);

    const { result } = renderHook(() => useCreateLink(), {
      wrapper: createWrapper(),
    });

    const linkData = {
      originalUrl: 'https://example.com',
      customShortUrl: 'abc123',
    };

    result.current.mutate(linkData);

    await waitFor(() => {
      expect(services.createLink).toHaveBeenCalledWith(linkData);
    });
  });

  it('should handle create link error', async () => {
    const error = new Error('Failed to create link');
    vi.mocked(services.createLink).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateLink(), {
      wrapper: createWrapper(),
    });

    const linkData = {
      originalUrl: 'https://example.com',
      customShortUrl: 'abc123',
    };

    result.current.mutate(linkData);

    await waitFor(() => {
      expect(services.createLink).toHaveBeenCalledWith(linkData);
    });
  });

  it('should invalidate links query on success', async () => {
    const mockLink = {
      id: '1',
      originalUrl: 'https://example.com',
      shortUrl: 'abc123',
    };
    vi.mocked(services.createLink).mockResolvedValue(mockLink);

    const { result } = renderHook(() => useCreateLink(), {
      wrapper: createWrapper(),
    });

    const linkData = {
      originalUrl: 'https://example.com',
      customShortUrl: 'abc123',
    };

    result.current.mutate(linkData);

    await waitFor(() => {
      expect(services.createLink).toHaveBeenCalledWith(linkData);
    });
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useCreateLink(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('should set pending state during mutation', async () => {
    const mockLink = {
      id: '1',
      originalUrl: 'https://example.com',
      shortUrl: 'abc123',
    };
    vi.mocked(services.createLink).mockResolvedValue(mockLink);

    const { result } = renderHook(() => useCreateLink(), {
      wrapper: createWrapper(),
    });

    const linkData = {
      originalUrl: 'https://example.com',
      customShortUrl: 'abc123',
    };

    result.current.mutate(linkData);

    await waitFor(() => {
      expect(services.createLink).toHaveBeenCalledWith(linkData);
    });
  });
});
