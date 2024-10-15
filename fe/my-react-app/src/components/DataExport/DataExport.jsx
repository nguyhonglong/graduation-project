import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';
import style from './DataExport.module.css';
import DGA from '../DGA/DGA';

function DataExport({ currentTransformer }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const { axiosInstance, user } = useAuth();
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);
  const dgaRef = useRef(null);

  useEffect(() => {
    if (currentTransformer && startDate && endDate) {
      fetchData();
    }
  }, [currentTransformer, startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/indexes/getIndexesByTransformer/${currentTransformer._id}`, {
        params: { startDate, endDate }
      });
      const formattedData = response.data.map(item => {
        const { _id, __v, updatedAt, transformer, ...rest } = item;
        const date = new Date(item.createdAt);
        return {
          ...rest,
          createdAt: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        };
      });
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Add user info
    doc.setFontSize(12);
    doc.text(`User: ${user.name}`, 10, 10);
    doc.text(`Email: ${user.email}`, 10, 20);
    doc.text(`Transformer: ${currentTransformer.name}`, 10, 30);

    // Add charts
    if (chartRef1.current && chart1) {
      const chartCanvas = chartRef1.current;
      const chartImage = chartCanvas.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 10, 40, 190, 100);
    }

    if (chartRef2.current && chart2) {
      const chartCanvas = chartRef2.current;
      const chartImage = chartCanvas.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 10, 150, 190, 100);
    }

    // Add DGA chart
    if (dgaRef.current) {
      const dgaCanvas = dgaRef.current.querySelector('canvas');
      const dgaImage = dgaCanvas.toDataURL('image/png');
      doc.addPage();
      doc.addImage(dgaImage, 'PNG', 10, 10, 190, 180);
    }

    // Add table
    if (data.length > 0) {
      doc.addPage();
      doc.autoTable({
        head: [Object.keys(data[0])],
        body: data.map(Object.values),
        startY: 10,
      });
    }

    doc.save(`transformer_${currentTransformer._id}_data.pdf`);
  };

  const exportCSV = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const csvData = data.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `${headers}\n${csvData}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transformer_${currentTransformer._id}_data.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    if (data.length > 0 && chartRef1.current && chartRef2.current) {
      // Destroy existing charts if they exist
      if (chart1) chart1.destroy();
      if (chart2) chart2.destroy();

      const ctx1 = chartRef1.current.getContext('2d');
      const ctx2 = chartRef2.current.getContext('2d');

      const createChart = (ctx, datasets, title) => {
        return new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.map(item => item.createdAt),
            datasets: datasets
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: title
            }
          }
        });
      };

      const chart1Data = ['TDCG', 'CO2', 'CO', 'O2'].map(key => ({
        label: key,
        data: data.map(item => item[key]),
        borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        fill: false
      }));

      const chart2Data = Object.keys(data[0])
        .filter(key => !['createdAt', 'TDCG', 'CO2', 'CO', 'O2'].includes(key))
        .map(key => ({
          label: key,
          data: data.map(item => item[key]),
          borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          fill: false
        }));

      const newChart1 = createChart(ctx1, chart1Data, 'TDCG, CO2, CO, O2');
      const newChart2 = createChart(ctx2, chart2Data, 'Other Indexes');

      setChart1(newChart1);
      setChart2(newChart2);
    }
  }, [data]);

  return (
    <div className={style.dataExportContainer}>
      <h1 className={style.title}>Export Transformer Data</h1>
      {currentTransformer ? (
        <>
          <div className={style.transformerInfo}>
            <h2>Selected Transformer: {currentTransformer.name}</h2>
          </div>
          <div className={style.controls}>
            <div className={style.dateControl}>
              <label htmlFor="startDate">Start Date:</label>
              <input 
                id="startDate"
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={style.dateControl}>
              <label htmlFor="endDate">End Date:</label>
              <input 
                id="endDate"
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          {data.length > 0 && (
            <div className={style.exportButtons}>
              <button className={style.exportButton} onClick={exportPDF}>Export PDF</button>
              <button className={style.exportButton} onClick={exportCSV}>Export CSV</button>
            </div>
          )}
          <div className={style.chartsContainer}>
            <canvas ref={chartRef1} />
            <canvas ref={chartRef2} />
          </div>
          <div ref={dgaRef}>
            <DGA currentTransformer={currentTransformer} />
          </div>
        </>
      ) : (
        <p className={style.noTransformer}>Please select a transformer to export data.</p>
      )}
    </div>
  );
}

export default DataExport;
