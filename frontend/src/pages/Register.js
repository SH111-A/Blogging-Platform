import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrors([]);

    // Simple client-side validation example (optional)
    if (!username.trim() || !email.trim() || !password) {
      setErrors([{ msg: 'All fields are required.' }]);
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, { username, email, password });
      setMsg('Registration successful. You can log in now.');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setMsg(err.response.data.message);
      } else {
        setMsg('Registration failed due to a server or network error.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Register</h2>

      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      {errors.length > 0 &&
        errors.map((error, idx) => (
          <p key={idx} style={{ color: 'red' }}>
            {error.msg}
          </p>
        ))}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        autoComplete="username"
      />
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
        autoComplete="new-password"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
