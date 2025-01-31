import React, { useState } from 'react';
import './AuthPage.css';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const endpoint = isLogin ? 'http://localhost:3000/api/auth/login' : 'http://localhost:3000/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Authentication failed');
      }

      if (isLogin) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setIsLogin(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Notes App</h1>
        <p className="welcome-text">
          {isLogin 
            ? "Welcome back! Please login to continue." 
            : "Create an account to get started!"}
        </p>
        
        {error && <p className="error-message">{error}</p>}

        <div className="auth-buttons">
          <button 
            className={`auth-button ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`auth-button ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          <button type="submit" className="submit-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="switch-text">
          {isLogin 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <button 
            className="switch-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
              });
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
