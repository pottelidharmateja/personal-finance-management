import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const SpendingPrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [futureDates, setFutureDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5500/api/predict-spending/${userId}`);
        if (!response.data || !response.data.predictions || !response.data.futureInputs) {
          throw new Error('Invalid API response. Missing predictions or futureInputs.');
        }

        setPredictions(response.data.predictions);

        const formattedDates = response.data.futureInputs.map(([month, day]) =>
          new Date(new Date().getFullYear(), month - 1, day).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        );
        setFutureDates(formattedDates);
      } catch (error) {
        console.error('Error fetching spending predictions:', error.message || error);
        setError('Failed to load predictions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const chartData = {
    labels: futureDates.length ? futureDates : ['No Data'],
    datasets: [
      {
        label: 'Predicted Spending',
        data: predictions,
        fill: true,
        borderColor: '#00bcd4', // Cyan color for the line
        backgroundColor: 'rgba(0, 188, 212, 0.2)', // Light cyan fill
        borderWidth: 3, // Line thickness
        pointBackgroundColor: '#00bcd4', // Cyan points
        pointRadius: 6, // Larger points for better visibility
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#FFFFFF', // White legend text
          font: {
            size: 16,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF', // White axis labels
          font: {
            size: 14,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF', // White axis labels
          font: {
            size: 14,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
        },
      },
    },
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', // Gradient background for a polished look
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        padding: '20px',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          marginBottom: '30px',
          textAlign: 'center',
          fontWeight: 'bold',
          textShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
        }}
      >
        Spending Prediction
      </h1>
      {loading ? (
        <p style={{ fontSize: '1.5rem', textAlign: 'center' }}>Loading predictions...</p>
      ) : error ? (
        <p style={{ color: '#FF5252', fontSize: '1.2rem', textAlign: 'center' }}>{error}</p>
      ) : (
        <div
          style={{
            width: '90%',
            maxWidth: '800px',
            background: 'rgba(43, 43, 64, 0.95)',
            borderRadius: '15px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            padding: '30px',
          }}
        >
          <div style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
          <p
            style={{
              marginTop: '20px',
              color: '#cccccc',
              textAlign: 'center',
              fontSize: '1rem',
              fontStyle: 'italic',
            }}
          >
            Predicted spending for the next few months based on your historical data.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpendingPrediction;
