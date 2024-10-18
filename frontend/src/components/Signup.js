import { useState } from 'react';
import axios from 'axios';

const Signup = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5500/api/auth/signup', { email, password });
      alert('Signup successful!');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Try again.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
