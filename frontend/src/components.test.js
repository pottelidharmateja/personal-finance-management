import { render, screen, fireEvent } from '@testing-library/react';
import Signup from './Signup';

describe('Signup Component', () => {
  test('renders signup form inputs and button', () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('submits signup form', () => {
    const { getByPlaceholderText, getByRole } = render(<Signup />);
    fireEvent.change(getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText(/confirm password/i), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    // Assertions for form submission logic
  });
});
