import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Header from './components/Header/Header';
import Nav from './components/Nav/Nav';
import Login from './components/Login/Login';
import Chart from './components/Content/Chart/Chart';
import Table from './components/Content/Table/Table';
import UserManagerment from './components/UserManagerment/UserManagement';
import Settings from './components/Settings/Settings';
import Transformer from './components/Transformer/Transformer';
import TransformersList from './components/Content/TransformerList/TransformerList';
import SubstationsList from './components/Content/SubstationList/SubstationList';
import style from './App.module.css';
import DataExport from './components/DataExport/DataExport';
import DGA from './components/DGA/DGA';

const data = [
  { CH4: 20, C2H4: 50, C2H2: 30 },
  { CH4: 40, C2H4: 30, C2H2: 30 }, 
  { CH4: 10, C2H4: 60, C2H2: 30 }, 
];


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

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [currentTransformer, setCurrentTransformer] = React.useState(null);
  const location = useLocation();

  const handleSetCurrentTransformer = (transformer) => {
    setCurrentTransformer(transformer);
  };

  const showTransformer = ['/bieu-do', '/bang', '/dga', '/nhap-xuat-du-lieu'].includes(location.pathname);

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
              <Route path="/dga" element={
                <ProtectedRoute>
                  <DGA currentTransformer={currentTransformer} />
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
              <Route path="/may-bien-ap" element={
                <ProtectedRoute>
                  <TransformersList/>
                </ProtectedRoute>
              } />
               <Route path="/tram-bien-ap" element={
                <ProtectedRoute>
                  <SubstationsList/>
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
              <Route path="/nhap-xuat-du-lieu" element={
                <ProtectedRoute requiredRole="admin">
                  <DataExport currentTransformer={currentTransformer} />
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
