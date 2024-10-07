import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Header from './components/Header/Header';
import Nav from './components/Nav/Nav';
import Login from './components/Login/Login';
import Chart from './components/Content/Chart/Chart';
import Table from './components/Content/Table/Table';
import UserManagerment from './components/UserManagerment/UserManagerment';
import Settings from './components/Settings/Settings';
import Transformer from './components/Transformer/Transformer';
import style from './App.module.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { isAuthenticated, logout } = useAuth();
  const [currentTransformer, setCurrentTransformer] = React.useState(null);

  const handleSetCurrentTransformer = (transformer) => {
    setCurrentTransformer(transformer);
  };

  return (
    <div>
      <div className={style.appContainer}>
        {isAuthenticated && <Header />}
        <div className={style.mainContent}>
          {isAuthenticated && <Nav onLogout={logout} />}
          <div className={style.pageContent}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Chart currentTransformer={currentTransformer} />
                </ProtectedRoute>
              } />
              <Route path="/bieu-do" element={
                <ProtectedRoute>
                  <Chart currentTransformer={currentTransformer} />
                </ProtectedRoute>
              } />
              <Route path="/bang" element={
                <ProtectedRoute>
                  <Table currentTransformer={currentTransformer} />
                </ProtectedRoute>
              } />
              <Route path="/user-management" element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagerment />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          {isAuthenticated && (
            <Transformer
              setCurrentTransformer={handleSetCurrentTransformer}
              currentTransformer={currentTransformer}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;