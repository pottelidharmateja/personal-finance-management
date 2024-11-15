import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../components/Login'; // Adjust the path as necessary

// Mock the axios module
jest.mock('axios');

describe('Login Component', () => {
  const handleTransitionMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  test('renders Login component', () => {
    render(
      <MemoryRouter>
        <Login handleTransition={handleTransitionMock} />
      </MemoryRouter>
    );

    // Check if the Login form is rendered
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('allows user to type in email and password fields', () => {
    render(
      <MemoryRouter>
        <Login handleTransition={handleTransitionMock} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Enter Email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows error message on login failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } });

    render(
      <MemoryRouter>
        <Login handleTransition={handleTransitionMock} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for error message to appear
    await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
  });

  test('navigates to the dashboard on successful login', async () => {
    axios.post.mockResolvedValue({ data: { token: 'mock-token' } });
    const { container } = render(
      <MemoryRouter>
        <Login handleTransition={handleTransitionMock} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for navigation to occur and token to be stored in localStorage
    await waitFor(() => expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token'));

    // You could mock and test if useNavigate has been called accordingly
    // This requires setting up the navigate function properly in the component
  });

  test('calls handleTransition when Back button is clicked', () => {
    render(
      <MemoryRouter>
        <Login handleTransition={handleTransitionMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Back/i }));

    expect(handleTransitionMock).toHaveBeenCalledWith('home');
  });
});