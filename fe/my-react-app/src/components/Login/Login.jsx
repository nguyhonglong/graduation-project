// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Thêm state cho lỗi
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (tải lại trang)
    
    setErrorMessage(''); // Reset lại thông báo lỗi khi người dùng gửi form

    try {
      const response = await axios.post('http://localhost:3000/v1/auth/login', { email, password });
      console.log('User logged in:', response.data);
      localStorage.setItem('token', response.data.tokens.access.token);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Unauthorized! Please check your email or password.');
      } else {
        setErrorMessage('There was an error logging in the user!');
      }
      console.error('Error logging in:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Hiển thị thông báo lỗi */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
