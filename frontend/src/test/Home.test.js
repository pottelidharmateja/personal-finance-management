import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../components/Home'; // Ensure the path is correct

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

  beforeEach(() => {
    // Mock localStorage to start with no token
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null), // Start with no token
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
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
    await waitFor(() => expect(screen.getByText(/Signup Component/i)).toBeInTheDocument());
  });

  test('switches to Login slide when Login button is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));
    await waitFor(() => expect(screen.getByText(/Login Component/i)).toBeInTheDocument());
  });

  test('returns to Home when clicking Back to Home from Signup', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Signup/i));
    fireEvent.click(await screen.findByText(/Back to Home/i)); // Waits for the button to appear
    await waitFor(() => expect(screen.getByText(/Welcome to Personal Finance Management/i)).toBeInTheDocument());
  });

  test('returns to Home when clicking Back to Home from Login', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));
    fireEvent.click(await screen.findByText(/Back to Home/i)); // Waits for the button to appear
    await waitFor(() => expect(screen.getByText(/Welcome to Personal Finance Management/i)).toBeInTheDocument());
  });

  test('redirects to dashboard if token exists', () => {
    // Simulate a token in local storage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'), // Mock that a token is available
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard'); // Verify navigation to the dashboard
  });
});