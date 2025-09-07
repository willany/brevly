import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useDeleteLink } from '../../hooks/useDeleteLink';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import { mockLink } from '../../test/test-utils';
import { LinkCard } from '../LinkCard';

vi.mock('../../hooks/useDeleteLink', () => ({
  useDeleteLink: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

const mockWriteText = vi.fn();
const mockOpen = vi.fn();
const mockConfirm = vi.fn();

Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

Object.assign(window, {
  open: mockOpen,
  confirm: mockConfirm,
});

describe('LinkCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
    mockConfirm.mockReturnValue(true);
  });

  it('renders link information correctly', () => {
    render(<LinkCard link={mockLink} />);

    expect(screen.getByText(mockLink.originalUrl)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockLink.accessCount} acessos`)
    ).toBeInTheDocument();
  });

  it('displays short URL with frontend URL', () => {
    render(<LinkCard link={mockLink} />);

    const shortUrlElement = screen.getByText(/abc123/);
    expect(shortUrlElement).toBeInTheDocument();
  });

  it('calls window.open when link info is clicked', () => {
    render(<LinkCard link={mockLink} />);

    const linkInfo = screen.getByText(mockLink.originalUrl).closest('div');
    fireEvent.click(linkInfo!);

    expect(mockOpen).toHaveBeenCalledWith(`/${mockLink.shortUrl}`, '_blank');
  });

  it('copies link to clipboard when copy button is clicked', async () => {
    render(<LinkCard link={mockLink} />);

    const copyButton = screen.getAllByRole('button')[0];
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        expect.stringContaining('abc123')
      );
    });
  });

  it('shows confirmation dialog when delete button is clicked', () => {
    render(<LinkCard link={mockLink} />);

    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.stringContaining(
        `Tem certeza que deseja deletar o link ${mockLink.shortUrl}?`
      )
    );
  });

  it('does not delete when confirmation is cancelled', () => {
    mockConfirm.mockReturnValue(false);
    const mockMutateAsync = vi.fn();

    useDeleteLink.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    render(<LinkCard link={mockLink} />);

    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('calls delete mutation when confirmation is accepted', async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue(undefined);

    useDeleteLink.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    render(<LinkCard link={mockLink} />);

    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(mockLink.id);
    });
  });

  it('disables delete button when mutation is pending', () => {
    useDeleteLink.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });

    render(<LinkCard link={mockLink} />);

    const deleteButton = screen.getAllByRole('button')[1];
    expect(deleteButton).toBeDisabled();
  });

  it('handles clipboard write error gracefully', async () => {
    mockWriteText.mockRejectedValue(new Error('Clipboard access denied'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<LinkCard link={mockLink} />);

    const copyButton = screen.getAllByRole('button')[0];
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to copy:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('handles delete mutation error gracefully', async () => {
    const mockMutateAsync = vi
      .fn()
      .mockRejectedValue(new Error('Delete failed'));

    useDeleteLink.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<LinkCard link={mockLink} />);

    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to delete link:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
