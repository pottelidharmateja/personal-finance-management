import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    render(<Dashboard />);
    const titleElement = screen.getByText(/dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders sidebar menu items', () => {
    render(<Dashboard />);
    const menuItems = screen.getAllByRole('listitem');
    expect(menuItems).toHaveLength(3); // Adjust if you have more menu items
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/accounts/i)).toBeInTheDocument();
  });

  test('renders monthly spending chart', () => {
    render(<Dashboard />);
    const chart = screen.getByRole('img', { name: /monthly spending/i });
    expect(chart).toBeInTheDocument();
  });
});
