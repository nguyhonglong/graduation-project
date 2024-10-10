import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Header from './components/Header/Header';
import Nav from './components/Nav/Nav';
import Login from './components/Login/Login';
import Chart from './components/Content/Chart/Chart';
import Table from './components/Content/Table/Table';
import UserManagerment from './components/UserManagerment/UserManagerment';
import Settings from './components/Settings/Settings';
import Transformer from './components/Transformer/Transformer';
import TransformerInfo from './components/Content/TransformerInfo/TransformerInfo';
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
  const location = useLocation();

  const handleSetCurrentTransformer = (transformer) => {
    setCurrentTransformer(transformer);
  };

  const showTransformer = ['/bieu-do', '/bang', '/tram-bien-ap','/dga'].includes(location.pathname);

  return (
    <div>
      <div className={style.appContainer}>
        {isAuthenticated && <Header />}
        <div className={style.mainContent}>
          {isAuthenticated && <Nav onLogout={logout} />}
          <div className={style.pageContent}>
            <TransformerInfo currentTransformer={currentTransformer} />
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
              <Route path="/tram-bien-ap" element={
                <ProtectedRoute>
                  <TransformerInfo currentTransformer={currentTransformer} />
                </ProtectedRoute>
              } />
              <Route path="/quan-ly-nguoi-dung" element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagerment />
                </ProtectedRoute>
              } />
              <Route path="/cai-dat" element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          {isAuthenticated && showTransformer && (
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