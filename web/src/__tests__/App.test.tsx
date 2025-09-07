import { describe, it, expect, vi } from 'vitest';

import { App } from '../App';
import { render, screen } from '../test/test-utils';

vi.mock('../hooks/useLinks', () => ({
  useLinks: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}));

vi.mock('../hooks/useCreateLink', () => ({
  useCreateLink: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('../hooks/useDeleteLink', () => ({
  useDeleteLink: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe('App', () => {
  it('renders the main application', () => {
    render(<App />);

    expect(screen.getByAltText('brev.ly')).toBeInTheDocument();
  });

  it('renders the link form', () => {
    render(<App />);

    expect(screen.getByText(/novo link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link original/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link encurtado/i)).toBeInTheDocument();
  });

  it('renders the links list', () => {
    render(<App />);

    expect(screen.getByText(/meus links/i)).toBeInTheDocument();
  });
});
