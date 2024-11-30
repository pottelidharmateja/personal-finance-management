import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import CashFlow from './components/CashFlow';
import Investments from './components/Investments';
import Categories from './components/Categories';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import ExpenseCategorizer from './components/ExpenseCategorizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protect these routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/cash-flow" element={<ProtectedRoute><CashFlow /></ProtectedRoute>} />
        <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        {/* Add ExpenseCategorizer Route */}
        <Route path="/categorizer" element={<ExpenseCategorizer />} />
      </Routes>
    </Router>
  );
}

export default App;
