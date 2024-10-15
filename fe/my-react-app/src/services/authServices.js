// src/services/authService.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_URL = 'http://localhost:3000/api/v1/';

const getToken = () => {
  return localStorage.getItem('accessToken');
};

const isLoggedIn = () => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      // Token hết hạn
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (e) {
    // Token không hợp lệ
    localStorage.removeItem('token');
    return false;
  }
};

// Axios interceptor để kiểm tra lỗi xác thực
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  getToken,
  isLoggedIn,
};
