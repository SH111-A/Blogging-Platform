import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrors([]);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (res.data.token && res.data.user) {
        login(res.data.token, res.data.user);
        navigate('/');
      } else {
        setMsg('Invalid login response from server.');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setMsg(err.response.data.message);
      } else {
        setMsg('Login failed: Network or server error.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      {errors.length > 0 &&
        errors.map((error, idx) => (
          <p key={idx} style={{ color: 'red' }}>
            {error.msg}
          </p>
        ))}

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
      </form>

      <hr />

      <a href={`${API_URL.replace('/api', '')}/api/auth/google`}>
        <button type="button">Login with Google</button>
      </a>
    </div>
  );
}

export default Login;
