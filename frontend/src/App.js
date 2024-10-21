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
import { AuthProvider } from './AuthContext';
import SignOutButton from './components/SignOutButton';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <SignOutButton />
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/cash-flow" element={<ProtectedRoute><CashFlow /></ProtectedRoute>} />
            <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
