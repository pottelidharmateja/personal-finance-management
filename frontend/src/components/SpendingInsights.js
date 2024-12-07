import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const SpendingInsights = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/predict-spending');
        setPredictions(response.data.predictions);
      } catch (error) {
        console.error('Error fetching spending predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const data = {
    labels: ['April', 'May', 'June'], // Future months
    datasets: [
      {
        label: 'Predicted Spending',
        data: predictions,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Spending Insights</h2>
      {loading ? <p>Loading...</p> : <Line data={data} />}
    </div>
  );
};

export default SpendingInsights;
