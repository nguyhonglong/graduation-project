import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';
import style from './DataExport.module.css';

function DataExport() {
  const [transformers, setTransformers] = useState([]);
  const [selectedTransformer, setSelectedTransformer] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const { axiosInstance, user } = useAuth();
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchTransformers = async () => {
      try {
        const response = await axiosInstance.get('/transformers');
        setTransformers(response.data);
      } catch (error) {
        console.error('Error fetching transformers:', error);
      }
    };
    fetchTransformers();
  }, [axiosInstance]);

  const fetchData = async () => {
    if (!selectedTransformer || !startDate || !endDate) return;
    try {
      const response = await axiosInstance.get(`/indexes/${selectedTransformer}`, {
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

    // Add chart
    if (chartRef.current && chart) {
      const chartCanvas = chartRef.current;
      const chartImage = chartCanvas.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 10, 30, 190, 100);
    }

    // Add table
    if (data.length > 0) {
      doc.autoTable({
        head: [Object.keys(data[0])],
        body: data.map(Object.values),
        startY: 140,
      });
    }

    doc.save('transformer_data.pdf');
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
      link.setAttribute('download', 'transformer_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      // Destroy existing chart if it exists
      if (chart) {
        chart.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.createdAt),
          datasets: Object.keys(data[0])
            .filter(key => key !== 'createdAt')
            .map(key => ({
              label: key,
              data: data.map(item => item[key]),
              borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
              fill: false
            }))
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Transformer Data'
          }
        }
      });

      setChart(newChart);
    }
  }, [data]);

  return (
    <div className={style.dataExportContainer}>
      <h1>Export Transformer Data</h1>
      <div className={style.controls}>
        <select 
          value={selectedTransformer} 
          onChange={(e) => setSelectedTransformer(e.target.value)}
        >
          <option value="">Select Transformer</option>
          {transformers.map(transformer => (
            <option key={transformer._id} value={transformer._id}>
              {transformer.name}
            </option>
          ))}
        </select>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchData}>Fetch Data</button>
      </div>
      {data.length > 0 && (
        <div className={style.exportButtons}>
          <button onClick={exportPDF}>Export PDF</button>
          <button onClick={exportCSV}>Export CSV</button>
        </div>
      )}
      <canvas ref={chartRef} />
    </div>
  );
}

export default DataExport;
