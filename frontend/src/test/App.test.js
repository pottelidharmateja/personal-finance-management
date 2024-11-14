import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App'; // Ensure this path is correct

// Test to ensure that the welcome message appears
test('renders welcome message', () => {
  render(<App />);
  expect(screen.getByText(/Welcome to Personal Finance Management/i)).toBeInTheDocument();
});