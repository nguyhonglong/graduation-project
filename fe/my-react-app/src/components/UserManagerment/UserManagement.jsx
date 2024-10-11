import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import style from './UserManagement.module.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [axiosInstance]);

  if (loading) {
    return <div className={style.loading}>Loading users...</div>;
  }

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  return (
    <div className={style.userManagementContainer}>
      <h1>Quản lý người dùng</h1>
      <table className={style.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Email Verified</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isEmailVerified ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
