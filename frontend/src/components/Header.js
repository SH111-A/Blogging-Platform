import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import './Header.css'; // Optional: for styling

function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/create">Create Post</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
