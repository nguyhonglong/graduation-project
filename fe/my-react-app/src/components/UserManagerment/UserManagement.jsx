import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import style from './UserManagement.module.css';
import { FaTrash, FaBell, FaBellSlash, FaUserPlus, FaUserShield, FaUser, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserManagement() {
  const { axiosInstance } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchUsers();
  }, [axiosInstance]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data.results);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
      toast.error('Failed to fetch users');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } catch (err) {
        setError('Failed to delete user');
        toast.error('Failed to delete user');
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
      toast.success('Notification permission updated successfully');
    } catch (err) {
      setError('Failed to update notification permission');
      toast.error('Failed to update notification permission');
    }
  };

  const handleAddUserClick = () => {
    setShowModal(true);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '', password: '' });
      setShowModal(false);
      toast.success('User added successfully');
    } catch (err) {
      setError('Failed to add user');
      toast.error('Failed to add user');
    }
  };

  const toggleAdminRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axiosInstance.patch(`/users/${userId}`, { role: newRole });
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, role: newRole }
          : user
      ));
      toast.success(`User role updated to ${newRole} successfully`);
    } catch (err) {
      setError('Failed to update user role');
      toast.error('Failed to update user role');
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
      
      <ul className={style.userList}>
        {users.map((user) => (
          <li key={user.id} className={style.userItem}>
            <div className={style.userInfo}>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <span>{user.role}</span>
            </div>
            <div className={style.userActions}>
              <button
                className={style.iconButton}
                onClick={() => toggleNotification(user.id, user.hasNotificationPermission)}
                title={user.hasNotificationPermission ? "Disable notifications" : "Enable notifications"}
              >
                {user.hasNotificationPermission ? <FaBell /> : <FaBellSlash />}
              </button>
              <button
                className={style.iconButton}
                onClick={() => toggleAdminRole(user.id, user.role)}
                title={user.role === 'admin' ? "Revoke admin role" : "Set as admin"}
              >
                {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
              </button>
              <button
                className={style.iconButton}
                onClick={() => deleteUser(user.id)}
                title="Delete user"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button className={style.addButton} onClick={handleAddUserClick}>
        <FaUserPlus /> Add User
      </button>
      
      {showModal && (
        <div className={style.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeButton} onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>
            <h2>Add New User</h2>
            <form className={style.addForm} onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
              />
              <div className={style.modalButtons}>
                <button type="submit">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default UserManagement;
