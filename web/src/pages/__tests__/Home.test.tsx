import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '../../test/test-utils';
import { Home } from '../Home';

vi.mock('../../components/LinkForm', () => ({
  LinkForm: () => <div data-testid='link-form'>Link Form</div>,
}));

vi.mock('../../components/LinksList', () => ({
  LinksList: () => <div data-testid='links-list'>Links List</div>,
}));

describe('Home', () => {
  it('renders the home page with logo', () => {
    render(<Home />);

    const logo = screen.getByAltText('brev.ly');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('Logo.svg'));
  });

  it('renders the link form component', () => {
    render(<Home />);

    expect(screen.getByTestId('link-form')).toBeInTheDocument();
  });

  it('renders the links list component', () => {
    render(<Home />);

    expect(screen.getByTestId('links-list')).toBeInTheDocument();
  });

  it('has proper container structure', () => {
    render(<Home />);

    const linkForm = screen.getByTestId('link-form');
    expect(linkForm).toBeInTheDocument();

    const linksList = screen.getByTestId('links-list');
    expect(linksList).toBeInTheDocument();
  });
});
