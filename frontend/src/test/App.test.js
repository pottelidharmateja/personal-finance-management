
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Transactions from '../components/Transactions';
import CashFlow from '../components/CashFlow';
import Investments from '../components/Investments';
import Categories from '../components/Categories';

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  test('renders Transactions component when navigating to /transactions', () => {
    render(
      <MemoryRouter initialEntries={['/transactions']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </MemoryRouter>
    );

    // Make sure to adjust the text being searched to accurately reflect what's rendered in Transactions component
    expect(screen.getByText(/Transactions to Review/i)).toBeInTheDocument(); 
  });

  test('renders CashFlow component when navigating to /cash-flow', () => {
    render(
      <MemoryRouter initialEntries={['/cash-flow']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cash-flow" element={<CashFlow />} />
        </Routes>
      </MemoryRouter>
    );

    // Adjust this text if necessary to match actual output in CashFlow component
    expect(screen.getByText(/This section will display cash flow details/i)).toBeInTheDocument(); 
  });

  test('renders Investments component when navigating to /investments', () => {
    render(
      <MemoryRouter initialEntries={['/investments']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/investments" element={<Investments />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the Investments content is displayed
    expect(screen.getByText(/Investments/i)).toBeInTheDocument();
  });

  test('renders Categories component when navigating to /categories', () => {
    render(
      <MemoryRouter initialEntries={['/categories']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the Categories content is displayed
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
  });
});