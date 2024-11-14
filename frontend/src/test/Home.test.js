import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../components/Home';

// Mock the Signup and Login components
jest.mock('../components/Signup', () => (props) => (
  <div>
    <h2>Signup Component</h2>
    <button onClick={() => props.handleTransition('home')}>Back to Home</button>
  </div>
));

jest.mock('../components/Login', () => (props) => (
  <div>
    <h2>Login Component</h2>
    <button onClick={() => props.handleTransition('home')}>Back to Home</button>
  </div>
));

// Mock the useNavigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders Home component initially', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome to Personal Finance Management/i)).toBeInTheDocument();
  });

  test('displays Signup and Login buttons', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Signup/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('switches to Signup slide when Signup button is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Signup/i));

    // Wait for the Signup Component to be in the document
    await waitFor(() => expect(screen.getByText(/Signup Component/i)).toBeInTheDocument());
  });

  test('switches to Login slide when Login button is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));

    // Wait for the Login Component to be in the document
    await waitFor(() => expect(screen.getByText(/Login Component/i)).toBeInTheDocument());
  });

  test('returns to Home when clicking Back to Home from Signup', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Signup/i));

    // Click 'Back to Home' button after signup
    fireEvent.click(await screen.findByText(/Back to Home/i)); // Using findByText waits for the element

    // Wait for Home to be back in the document
    await waitFor(() => expect(screen.getByText(/Welcome to Personal Finance Management/i)).toBeInTheDocument());
  });

  test('returns to Home when clicking Back to Home from Login', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));

    // Click 'Back to Home' button after login
    fireEvent.click(await screen.findByText(/Back to Home/i)); // Using findByText waits for the element

    // Wait for Home to be back in the document
    await waitFor(() => expect(screen.getByText(/Welcome to Personal Finance Management/i)).toBeInTheDocument());
  });

  test('redirection to dashboard if token exists', () => {
    // Mock localStorage to contain a token
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        clear: jest.fn(),
      },
      writable: true,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard'); // Check if navigate was called
  });
});