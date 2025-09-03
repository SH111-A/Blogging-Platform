import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function SocialLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      login(token); // Save token and update auth state
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, login, navigate]);

  return <p>Logging you in...</p>;
}

export default SocialLogin;
