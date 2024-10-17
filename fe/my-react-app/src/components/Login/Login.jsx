import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import style from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred during login.');
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.loginBox}>
        <h2 className={style.loginTitle}>Chào mừng trở lại</h2>
        <form onSubmit={handleSubmit} className={style.loginForm}>
          {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
          <div className={style.inputGroup}>
            <label htmlFor="email">Tài khoản</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
            />
          </div>
          <div className={style.inputGroup}>
            <label htmlFor="password">Mật Khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button type="submit" className={style.loginButton}>Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;