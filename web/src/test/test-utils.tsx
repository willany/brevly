import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

export const mockLink = {
  id: '1',
  originalUrl: 'https://example.com',
  shortUrl: 'abc123',
  prefix: 'abc123',
  createdAt: '2024-01-01T00:00:00Z',
  accessCount: 0,
};

export const mockLinks = [
  mockLink,
  {
    id: '2',
    originalUrl: 'https://google.com',
    shortUrl: 'def456',
    prefix: 'def456',
    createdAt: '2024-01-02T00:00:00Z',
    accessCount: 5,
  },
];
