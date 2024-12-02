import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../AuthContext';
import style from './TransformerList.module.css';
import { FaSearch, FaTimes, FaPlus, FaUpload } from 'react-icons/fa';
import AddTransformerForm from './AddTransformerForm';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function TransformersList() {
  const [transformers, setTransformers] = useState([]);
  const [selectedTransformer, setSelectedTransformer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [file, setFile] = useState(null);
  const { axiosInstance, user } = useAuth();  // Add user here
  const [transformerStats, setTransformerStats] = useState({ ok: 0, notOk: 0 });

  useEffect(() => {
    const fetchTransformers = async () => {
      try {
        const response = await axiosInstance.get('/transformers');
        setTransformers(response.data);
        // Calculate transformer stats
        const stats = response.data.reduce((acc, transformer) => {
          if (transformer.serviceState?.toUpperCase() === "OK") {
            acc.ok++;
          } else {
            acc.notOk++;
          }
          return acc;
        }, { ok: 0, notOk: 0 });
        setTransformerStats(stats);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTransformers();
  }, [axiosInstance]);

  const handleTransformerClick = useCallback(async (id) => {
    setDetailsLoading(true);
    try {
      const response = await axiosInstance.get(`/transformers/${id}`);
      setSelectedTransformer(response.data);
    } catch (error) {
      console.error('Error fetching transformer details:', error);
    } finally {
      setDetailsLoading(false);
    }
  }, [axiosInstance]);

  const handleCloseModal = useCallback(() => {
    setSelectedTransformer(null);
  }, []);

  const filteredTransformers = useMemo(() =>
    transformers.filter((transformer) =>
      transformer.name && transformer.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [transformers, searchTerm]);

  const handleAddTransformer = () => {
    setShowAddForm(true);
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const response = await axiosInstance.post('/transformers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);
        // Refresh the transformer list after successful upload
        fetchTransformers();
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('An error occurred while uploading the file.');
      }
    }
  };

  const handleTransformerAdded = (newTransformer) => {
    setTransformers([...transformers, newTransformer]);
    setShowAddForm(false);
    // Update transformer stats
    setTransformerStats(prevStats => ({
      ok: newTransformer.serviceState?.toUpperCase() === "OK" ? prevStats.ok + 1 : prevStats.ok,
      notOk: newTransformer.serviceState?.toUpperCase() !== "OK" ? prevStats.notOk + 1 : prevStats.notOk
    }));
  };

  const chartData = {
    labels: ['OK', 'Not OK'],
    datasets: [
      {
        data: [transformerStats.ok, transformerStats.notOk],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  if (loading) {
    return <div className={style.loading}>Đang tải danh sách máy biến áp...</div>;
  }

  if (error) {
    return <div className={style.error}>Lỗi khi tải dữ liệu: {error.message}</div>;
  }

  return (
    <div className={style.transformerList}>
      <h1>Danh sách máy biến áp</h1>

      <div className={style.contentRow}>
        {/* Pie chart */}
        <div className={style.chartContainer}>
          <h2>Trạng thái máy biến áp</h2>
          <Pie data={chartData} />
        </div>

        {/* List container */}
        <div className={style.listWrapper}>
          <div className={style.searchContainer}>
            <FaSearch className={style.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm máy biến áp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={style.searchInput}
            />
          </div>

          <div className={style.listContainer}>
            {filteredTransformers.length === 0 ? (
              <div className={style.noResults}>Không tìm thấy kết quả phù hợp</div>
            ) : (
              <ul className={style.transformersList}>
                {filteredTransformers.map((transformer) => (
                  <li
                    key={transformer._id}
                    onClick={() => handleTransformerClick(transformer._id)}
                    className={style.transformerItem}
                  >
                    <span
                      className={`${style.statusNode} ${transformer.serviceState?.toUpperCase() === "OK" ? style.statusOK : style.statusNotOK}`}
                      title={`Service State: ${transformer.serviceState}`}
                    ></span>
                    &nbsp;&nbsp;
                    {transformer.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {selectedTransformer && (
        <div className={style.modalOverlay} onClick={handleCloseModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết máy biến áp</h2>
            {detailsLoading ? (
              <div className={style.modalLoading}>
                <div className={style.spinner}></div>
                <p>Đang tải thông tin...</p>
              </div>
            ) : (
              <>
                <p><strong>Tên:</strong> {selectedTransformer.name}</p>
                <p><strong>ID:</strong> {selectedTransformer._id}</p>
                <p><strong>Trạng thái cảnh báo:</strong> {selectedTransformer.alarmState}</p>
                <p>
                  <strong>Trạng thái hoạt động:</strong>
                  <span className={`${style.statusNode} ${selectedTransformer.serviceState === "OK" ? style.statusOK : style.statusNotOK}`}></span>
                  {selectedTransformer.serviceState}
                </p>
                <p><strong>Nhà sản xuất:</strong> {selectedTransformer.transformerManufacturer}</p>
                <p><strong>Số sê-ri:</strong> {selectedTransformer.serialnumber}</p>
                <p><strong>Điện áp định mức:</strong> {selectedTransformer.ratedVoltage}</p>
                <p><strong>Loại giám sát:</strong> {selectedTransformer.monitorType}</p>
              </>
            )}
            <button className={style.cancelButton} onClick={handleCloseModal}>
              Đóng
            </button>
          </div>
        </div>

      )}

      {showAddForm && (
        <AddTransformerForm
          onTransformerAdded={handleTransformerAdded}
          onCancel={() => setShowAddForm(false)}
          axiosInstance={axiosInstance}
        />
      )}

      {user && user.role === 'admin' && (
        <div className={style.adminControls}>
          <button onClick={handleAddTransformer} className={style.adminButton}>
            <FaPlus />  Thêm máy biến áp
          </button>
          <label htmlFor="fileInput" className={style.adminButton}>
            <FaUpload /> &nbsp; Upload CSV/JSON
            <input
              type="file"
              accept=".csv, .json"
              onChange={handleFileUpload}
              id="fileInput"
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default TransformersList;
