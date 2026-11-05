import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ForecastCard.css';

/**
 * ForecastCard — "Next month, you're trending to spend $X".
 *
 * Fetches GET /api/forecast (JWT from localStorage, same pattern as
 * DashboardContent) and shows the total plus the per-category breakdown,
 * with each category's method (linear trend vs. plain average) so the
 * number is never presented as more certain than it is.
 *
 * States: loading -> forecast | "not enough data yet" | error.
 * A forecast with no expense records is not an error — it means the
 * user hasn't entered spending yet, and the card says so.
 */
const ForecastCard = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchForecast = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Log in to see your forecast.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:5500/api/forecast', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForecast(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching forecast:', error.message);
        setErrorMessage('Could not load your forecast. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  if (loading) {
    return (
      <div className="forecast-card">
        <p>Working out next month&apos;s forecast…</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="forecast-card">
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!forecast || !forecast.by_category || forecast.by_category.length === 0) {
    return (
      <div className="forecast-card">
        <h2>Next month&apos;s forecast</h2>
        <p>Add some expense records first — the forecast needs your spending history to work with.</p>
      </div>
    );
  }

  return (
    <div className="forecast-card">
      <h2>Next month&apos;s forecast</h2>
      <p className="forecast-total">
        In {forecast.next_month}, you&apos;re trending to spend{' '}
        <strong>${forecast.total_forecast.toLocaleString()}</strong>
      </p>
      <ul className="forecast-breakdown">
        {forecast.by_category.map((item) => (
          <li key={item.category}>
            <span>{item.category}</span>
            <span>${item.forecast.toLocaleString()}</span>
            <span className="forecast-method">{item.method}</span>
          </li>
        ))}
      </ul>
      <p className="forecast-note">{forecast.note}</p>
    </div>
  );
};

export default ForecastCard;
