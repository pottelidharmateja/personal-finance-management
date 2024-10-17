import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FinanceDashboard from './FinanceDashboard'; // Adjust to the path of your component

describe('Finance Dashboard', () => {
  test('should render the dashboard and display the user info', () => {
    render(<FinanceDashboard />);

    // Check if user info is displayed
    expect(screen.getByText('Welcome back, Chandu!')).toBeInTheDocument();
    expect(screen.getByText('Ponguru Chandu')).toBeInTheDocument();
  });

  test('should render cards with correct values', () => {
    render(<FinanceDashboard />);

    // Check if cards are rendered with correct values
    expect(screen.getByText('$15,700.00')).toBeInTheDocument(); // Total Balance
    expect(screen.getByText('$8,500.00')).toBeInTheDocument(); // Income
    expect(screen.getByText('$6,222.00')).toBeInTheDocument(); // Expense
    expect(screen.getByText('$32,913.00')).toBeInTheDocument(); // Total Savings
  });

  test('should render recent transactions table', () => {
    render(<FinanceDashboard />);

    // Check if the transactions table is rendered
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('25 Jul 12:30')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('VISA **3254')).toBeInTheDocument();
  });
});
