import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import style from './UserManagement.module.css';
import { FaTrash, FaBell, FaBellSlash } from 'react-icons/fa';

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

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const toggleNotification = async (userId, currentPermission) => {
    try {
      await axiosInstance.patch(`/users/${userId}`, {
        hasNotificationPermission: (!currentPermission).toString()
      });
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, hasNotificationPermission: !currentPermission }
          : user
      ));
    } catch (err) {
      setError('Failed to update notification permission');
    }
  };

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
            <th>Notifications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>
                <button
                  className={style.iconButton}
                  onClick={() => toggleNotification(user.id, user.hasNotificationPermission)}
                >
                  {user.hasNotificationPermission ? <FaBell /> : <FaBellSlash />}
                </button>
              </td>
              <td>
                <button
                  className={style.iconButton}
                  onClick={() => deleteUser(user.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
