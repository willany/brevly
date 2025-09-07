import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useCreateLink } from '../../hooks/useCreateLink';
import { render, screen, waitFor } from '../../test/test-utils';
import { LinkForm } from '../LinkForm';

const mockMutateAsync = vi.fn();
vi.mock('../../hooks/useCreateLink', () => ({
  useCreateLink: vi.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  })),
}));

describe('LinkForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with all required fields', () => {
    render(<LinkForm />);

    expect(screen.getByText('Novo link')).toBeInTheDocument();
    expect(screen.getByLabelText(/link original/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link encurtado/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /salvar link/i })
    ).toBeInTheDocument();
  });

  it('shows validation error for empty original URL', async () => {
    render(<LinkForm />);

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/url é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid URL format', async () => {
    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.type(originalUrlInput, 'invalid-url');

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /por favor, insira uma url válida com http:\/\/ ou https:\/\//i
        )
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid custom short URL', async () => {
    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.type(originalUrlInput, 'https://example.com');

    const customShortUrlInput = screen.getByLabelText(/link encurtado/i);
    await user.type(customShortUrlInput, 'invalid@url');

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /url personalizada pode conter apenas letras, números, hífens e sublinhados/i
        )
      ).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    mockMutateAsync.mockResolvedValue({ id: '1' });

    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.type(originalUrlInput, 'https://example.com');

    const customShortUrlInput = screen.getByLabelText(/link encurtado/i);
    await user.type(customShortUrlInput, 'example');

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        originalUrl: 'https://example.com',
        customShortUrl: 'example',
      });
    });
  });

  it('resets form after successful submission', async () => {
    mockMutateAsync.mockResolvedValue({ id: '1' });

    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.type(originalUrlInput, 'https://example.com');

    const customShortUrlInput = screen.getByLabelText(/link encurtado/i);
    await user.type(customShortUrlInput, 'example');

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(originalUrlInput).toHaveValue('');
      expect(customShortUrlInput).toHaveValue('');
    });
  });

  it('shows error message for 409 conflict (duplicate custom URL)', async () => {
    const error = {
      response: {
        status: 409,
      },
    };
    mockMutateAsync.mockRejectedValue(error);

    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.type(originalUrlInput, 'https://example.com');

    const customShortUrlInput = screen.getByLabelText(/link encurtado/i);
    await user.type(customShortUrlInput, 'duplicate');

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/esta url personalizada já está em uso/i)
      ).toBeInTheDocument();
    });
  });

  it('shows error message for server error', async () => {
    const error = {
      response: {
        data: {
          error: 'Server error message',
        },
      },
    };
    mockMutateAsync.mockRejectedValue(error);

    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.type(originalUrlInput, 'https://example.com');

    const customShortUrlInput = screen.getByLabelText(/link encurtado/i);
    await user.type(customShortUrlInput, 'example');

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Server error message')).toBeInTheDocument();
    });
  });

  it('shows generic error message for network error', async () => {
    const error = new Error('Network error');
    mockMutateAsync.mockRejectedValue(error);

    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.type(originalUrlInput, 'https://example.com');

    const customShortUrlInput = screen.getByLabelText(/link encurtado/i);
    await user.type(customShortUrlInput, 'example');

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('clears original URL error on blur', async () => {
    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.click(originalUrlInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/url é obrigatória/i)).toBeInTheDocument();
    });

    await user.click(originalUrlInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.queryByText(/url é obrigatória/i)).not.toBeInTheDocument();
    });
  });

  it('clears custom short URL error on blur', async () => {
    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    await user.type(originalUrlInput, 'https://example.com');

    const customShortUrlInput = screen.getByLabelText(/link encurtado/i);
    await user.type(customShortUrlInput, 'invalid@url');

    const submitButton = screen.getByRole('button', { name: /salvar link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /url personalizada pode conter apenas letras, números, hífens e sublinhados/i
        )
      ).toBeInTheDocument();
    });

    await user.click(customShortUrlInput);
    await user.tab();

    await waitFor(() => {
      expect(
        screen.queryByText(/url personalizada inválida/i)
      ).not.toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const slowPromise = new Promise(() => {});
    useCreateLink.mockReturnValue({
      mutateAsync: vi.fn().mockReturnValue(slowPromise),
      isPending: false,
    });

    render(<LinkForm />);

    const originalUrlInput = screen.getByLabelText(/link original/i);
    const customShortUrlInput = screen.getByLabelText(/link encurtado/i);
    const submitButton = screen.getByRole('button', { name: /salvar link/i });

    await user.type(originalUrlInput, 'https://example.com');
    await user.type(customShortUrlInput, 'example');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /salvando\.\.\./i })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', { name: /salvando\.\.\./i })
    ).toBeDisabled();
  });
});
