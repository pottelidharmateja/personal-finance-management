import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5500/api/finance/records', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {records.length > 0 ? (
        <ul>
          {records.map((record) => (
            <li key={record._id}>
              {record.title}: ${record.amount} ({record.type})
            </li>
          ))}
        </ul>
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );
};

export default Dashboard;
