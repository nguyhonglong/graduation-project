import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import SettingsModal from './components/Header/SettingsModal';
import Update from './components/Update/Update';

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
  const { isAuthenticated, logout, axiosInstance, loading } = useAuth();
  const [currentTransformer, setCurrentTransformer] = React.useState(null);
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated, axiosInstance]);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const updateSetting = async (measurementType, highLimit, highHighLimit) => {
    try {
      const response = await axiosInstance.put('/settings', {
        measurementType,
        highLimit,
        highHighLimit
      });
      const updatedSetting = response.data;
      setSettings(prevSettings =>
        prevSettings.map(setting =>
          setting.measurementType === updatedSetting.measurementType ? updatedSetting : setting
        )
      );
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Failed to update setting:', error.response?.data?.message || error.message);
      toast.error('Failed to update setting: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSetCurrentTransformer = (transformer) => {
    setCurrentTransformer(transformer);
  };

  const showTransformer = ['/bieu-do', '/bang', '/dga', '/nhap-xuat-du-lieu'].includes(location.pathname);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={style.appContainer}>
        {isAuthenticated && <Header onOpenSettings={() => setShowSettings(true)} />}
        <div className={style.mainContent}>
          {isAuthenticated && <Nav onLogout={logout} />}
          <div className={style.pageContent}>
           
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path="/" element={
                isAuthenticated ? (
                  <Chart currentTransformer={currentTransformer} />
                ) : (
                  <Navigate to="/login" />
                )
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
              <Route path="/update-and-maintainer" element={
                <ProtectedRoute>
                  <Update/>
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
      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onUpdateSetting={updateSetting}
        />
      )}
      <ToastContainer position="bottom-right" />
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
