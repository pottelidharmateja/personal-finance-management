import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
  test('renders login form inputs and button', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits login form', () => {
    const { getByPlaceholderText, getByRole } = render(<Login />);
    fireEvent.change(getByPlaceholderText(/username/i), { target: { value: 'user' } });
    fireEvent.change(getByPlaceholderText(/password/i), { target: { value: 'password' } });
    // Assertions for form submission logic
  });
});
