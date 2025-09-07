import { describe, it, expect, vi } from 'vitest';

import { render, screen, fireEvent } from '../../test/test-utils';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders with primary variant by default', () => {
    render(<Button>Primary Button</Button>);

    const button = screen.getByRole('button', { name: /primary button/i });
    expect(button.className).toContain('btnPrimary');
  });

  it('renders with secondary variant', () => {
    render(<Button variant='secondary'>Secondary Button</Button>);

    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button.className).toContain('btnSecondary');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size='sm'>Small</Button>);
    expect(screen.getByRole('button').className).toContain('btnSm');

    rerender(<Button size='md'>Medium</Button>);
    expect(screen.getByRole('button').className).not.toContain('btnSm');
    expect(screen.getByRole('button').className).not.toContain('btnLg');

    rerender(<Button size='lg'>Large</Button>);
    expect(screen.getByRole('button').className).toContain('btnLg');
  });

  it('renders with default md size', () => {
    render(<Button>Default Size</Button>);
    expect(screen.getByRole('button').className).not.toContain('btnSm');
    expect(screen.getByRole('button').className).not.toContain('btnLg');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>);

    const button = screen.getByRole('button', { name: /loading button/i });
    expect(button).toBeDisabled();
    expect(button.className).toContain('btnLoading');
    expect(screen.getByRole('button')).toContainHTML('<span class=');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button.className).toContain('btnDisabled');
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading Button</Button>);

    const button = screen.getByRole('button', { name: /loading button/i });
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);

    const button = screen.getByRole('button', { name: /clickable button/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled button/i });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /loading button/i });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className='custom-class'>Custom Button</Button>);

    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('custom-class');
  });

  it('forwards other props to button element', () => {
    render(
      <Button data-testid='custom-button' type='submit'>
        Submit Button
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
