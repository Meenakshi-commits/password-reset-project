import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const [validToken, setValidToken] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/verify-token?token=${token}`);
        if (response.data.valid) {
          setValidToken(true);
        } else {
          setMessage(response.data.message || 'Invalid or expired token.');
        }
      } catch (error) {
        console.error(error);
        setMessage('Error verifying token.');
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', { token, password });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Error occurred. Please try again.');
    }
  };

  if (!validToken) return <div className="text-center mt-10">{message}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-5 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default ResetPassword;
