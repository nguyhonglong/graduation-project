import React from 'react';
import style from './AdvancedAnalysis.module.css';
import { FaHeartbeat, FaHourglassHalf, FaExclamationTriangle } from 'react-icons/fa';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

function AdvancedAnalysis({ currentTransformer }) {
  // Data for error distribution pie chart
  const errorData = {
    labels: ['Bình thường', 'Rủi ro', 'Nguy hiểm'],
    datasets: [{
      data: [8, 3, 1],
      backgroundColor: [
        '#4CAF50',  // Normal - Green
        '#FFA726',  // At Risk - Orange
        '#EF5350',  // Critical - Red
      ],
      borderWidth: 1,
    }],
  };

  // Generate fake health index data for the past month
  const generateHealthData = () => {
    const dates = [];
    const values = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('vi-VN'));
      // Generate a random value between 88 and 95
      values.push(92 + (Math.random() * 3 - 1.5));
    }
    
    return { dates, values };
  };

  const healthData = generateHealthData();
  
  const healthIndexChartData = {
    labels: healthData.dates,
    datasets: [{
      label: 'Chỉ số sức khỏe',
      data: healthData.values,
      borderColor: '#0066cc',
      tension: 0.4,
      fill: false,
    }],
  };

  const healthIndexOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Biến động chỉ số sức khỏe trong tháng',
      },
    },
    scales: {
      y: {
        min: 85,
        max: 100,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Phân bố cảnh báo',
      },
      legend: {
        position: 'bottom',
      },
    },
  };

  // Add table data formatting function
  const formatDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString('vi-VN');
  };

  const predictions = {
    "predictions": [
      {
        "Hydrogen": 197.67295041495038,
        "Oxygen": 9693.445175630735,
        "Methane": 57.70473900174603,
        "CO": 255.93398802054634,
        "CO2": 1869.711602651217,
        "Ethylene": 169.75719614427285,
        "Ethane": 47.85623486367176,
        "Acetylene": 161.8269502982614,
        "H2O": 18.490354957271634
      },
      
      {
        "Hydrogen": 197.3516497130079,
        "Oxygen": 9695.466487859308,
        "Methane": 57.700620080581785,
        "CO": 255.93039706513625,
        "CO2": 1869.726719503437,
        "Ethylene": 169.64931191484166,
        "Ethane": 47.8146091839519,
        "Acetylene": 161.80262605402402,
        "H2O": 18.49073966228715
    },
    {
        "Hydrogen": 197.62058743068982,
        "Oxygen": 9691.080828563745,
        "Methane": 57.66420167948331,
        "CO": 255.92110843693015,
        "CO2": 1869.6413932709056,
        "Ethylene": 169.82964772363516,
        "Ethane": 47.84686232914706,
        "Acetylene": 161.7235434855157,
        "H2O": 18.493009676650235
    },
    {
        "Hydrogen": 197.3516497130079,
        "Oxygen": 9695.466487859308,
        "Methane": 57.700620080581785,
        "CO": 255.93039706513625,
        "CO2": 1869.726719503437,
        "Ethylene": 169.64931191484166,
        "Ethane": 47.8146091839519,
        "Acetylene": 161.80262605402402,
        "H2O": 18.49073966228715
    },
    {
        "Hydrogen": 197.62058743068982,
        "Oxygen": 9691.080828563745,
        "Methane": 57.66420167948331,
        "CO": 255.92110843693015,
        "CO2": 1869.6413932709056,
        "Ethylene": 169.82964772363516,
        "Ethane": 47.84686232914706,
        "Acetylene": 161.7235434855157,
        "H2O": 18.493009676650235
    }
    ]
  };

  const warningHistory = [
    {
      id: 1,
      type: "Very Low Breakdown",
      parameter: "Voltage of Oil (BDV)",
      risk: "Operating Risk",
      level: "high",
      timestamp: "Aug 17, 2023, 3:07:27 AM"
    },
    {
      id: 2,
      type: "Extreme Levels of",
      parameter: "Acetylene (C2H2)",
      risk: "Defective Risk",
      level: "critical",
      timestamp: "Aug 17, 2023, 3:07:27 AM"
    },
    {
      id: 3,
      type: "Dielectric level",
      parameter: "Out of range",
      risk: "Defective Risk",
      level: "critical",
      timestamp: "Aug 17, 2023, 3:07:27 AM"
    }
  ];

  if (!currentTransformer) {
    return (
      <div className={style.container}>
        <p>Chọn một máy biến áp để xem thông tin phân tích...</p>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <h1>Phân tích nâng cao: {currentTransformer.name}</h1>
      
      <div className={style.statsContainer}>
        <div className={style.statCard}>
          <div className={style.statHeader}>
            <FaHeartbeat className={style.icon} />
            <h2>Chỉ số sức khỏe</h2>
          </div>
          <div className={style.statValue}>
            <span className={style.number}>92</span>
            <span className={style.unit}>%</span>
          </div>
          <div className={style.statDescription}>
            Máy biến áp đang trong tình trạng tốt
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statHeader}>
            <FaHourglassHalf className={style.icon} />
            <h2>Tuổi thọ dự kiến</h2>
          </div>
          <div className={style.statValue}>
            <span className={style.number}>56</span>
            <span className={style.unit}>năm</span>
          </div>
          <div className={style.statDescription}>
            Dựa trên điều kiện vận hành hiện tại
          </div>
        </div>
      </div>

      <div className={style.chartsRow}>
        <div className={style.smallChartCard}>
          <Pie data={errorData} options={pieChartOptions} />
        </div>
        <div className={style.smallChartCard}>
          <Line data={healthIndexChartData} options={healthIndexOptions} />
        </div>
      </div>

      <div className={style.tableContainer}>
        <h2>Dự đoán nồng độ khí trong 5 ngày tới</h2>
        <div className={style.tableWrapper}>
          <table className={style.predictionsTable}>
            <thead>
              <tr>
                <th>Thông số</th>
                {[1, 2, 3, 4, 5].map(day => (
                  <th key={day}>{formatDate(day)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(predictions.predictions[0]).map(gas => (
                <tr key={gas}>
                  <td>{gas}</td>
                  {predictions.predictions.map((day, index) => (
                    <td key={index}>{day[gas].toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={style.warningContainer}>
        <h2>
          <FaExclamationTriangle className={style.warningIcon} />
          Lịch sử cảnh báo
        </h2>
        <div className={style.warningList}>
          {warningHistory.map((warning) => (
            <div 
              key={warning.id} 
              className={`${style.warningCard} ${style[warning.level]}`}
            >
              <div className={style.warningHeader}>
                <div className={style.warningTitle}>
                  {warning.type}
                </div>
                <div className={style.warningParameter}>
                  {warning.parameter}
                </div>
              </div>
              <div className={style.warningInfo}>
                <div className={style.warningRisk}>
                  {warning.risk}
                </div>
                <div className={style.warningTime}>
                  {warning.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdvancedAnalysis; 