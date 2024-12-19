import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { FaHeartbeat, FaExclamationTriangle, FaBolt, FaBell } from 'react-icons/fa';
import { Line, Pie } from 'react-chartjs-2';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { axiosInstance } = useAuth();
  const [stats, setStats] = useState({
    totalTransformers: 0,
    healthyTransformers: 0,
    warningTransformers: 0,
    criticalTransformers: 0,
    substations: 0
  });

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [substations, setSubstations] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/transformers/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    // Fetch recent alerts
    const fetchRecentAlerts = async () => {
      try {
        const response = await axiosInstance.get('/v1/alerts/recent');
        setRecentAlerts(response.data);
      } catch (error) {
        console.error('Error fetching recent alerts:', error);
      }
    };

    // Fetch substations
    const fetchSubstations = async () => {
      try {
        const response = await axiosInstance.get('/substations');
        setSubstations(response.data);
      } catch (error) {
        console.error('Error fetching substations:', error);
      }
    };

    fetchDashboardData();
    fetchRecentAlerts();
    fetchSubstations();
  }, []);

  // Health distribution chart data
  const healthData = {
    labels: ['Healthy', 'Warning', 'Critical'],
    datasets: [{
      data: [stats.healthyTransformers, stats.warningTransformers, stats.criticalTransformers],
      backgroundColor: ['#4CAF50', '#FFA726', '#EF5350'],
      borderWidth: 1,
    }],
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>System Overview</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FaBolt className={styles.icon} />
          <div className={styles.statInfo}>
            <h3>Total Transformers</h3>
            <p className={styles.statValue}>{stats.totalTransformers}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <FaHeartbeat className={styles.icon} />
          <div className={styles.statInfo}>
            <h3>Healthy Units</h3>
            <p className={styles.statValue}>{stats.healthyTransformers}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <FaExclamationTriangle className={styles.icon} />
          <div className={styles.statInfo}>
            <h3>Critical Units</h3>
            <p className={styles.statValue}>{stats.criticalTransformers}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h2>Health Distribution</h2>
          <div className={styles.chartWrapper}>
            <Pie data={healthData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.alertsContainer}>
        <h2>Recent Alerts</h2>
        <ul className={styles.alertsList}>
          {recentAlerts.map(alert => (
            <li key={alert.id} className={styles.alertItem}>
              <FaBell className={styles.alertIcon} />
              <span>{alert.message}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.substationsContainer}>
        <h2>Substations</h2>
        <ul className={styles.substationsList}>
          {substations.map(substation => (
            <li key={substation.id} className={styles.substationItem}>
              <span>{substation.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard; 