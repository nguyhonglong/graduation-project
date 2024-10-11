import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../AuthContext';
import style from './SubstationList.module.css';
import { FaSearch } from 'react-icons/fa';
import AddSubstationForm from './AddSubstationForm';

function SubstationsList() {
  const [substations, setSubstations] = useState([]);
  const [transformers, setTransformers] = useState([]);
  const [selectedSubstation, setSelectedSubstation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { axiosInstance } = useAuth();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [file, setFile] = useState(null);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [substationsResponse, transformersResponse] = await Promise.all([
          axiosInstance.get('/substations'),
          axiosInstance.get('/transformers')
        ]);
        setSubstations(substationsResponse.data);
        setTransformers(transformersResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosInstance]);

  const handleSubstationClick = useCallback(async (id) => {
    setDetailsLoading(true);
    try {
      const response = await axiosInstance.get(`/substations/${id}`);
      setSelectedSubstation(response.data);
    } catch (error) {
      console.error('Error fetching substation details:', error);
    } finally {
      setDetailsLoading(false);
    }
  }, [axiosInstance]);

  const handleCloseModal = useCallback(() => {
    setSelectedSubstation(null);
  }, []);

  const getTransformerStats = useCallback((substationId) => {
    const substationTransformers = transformers.filter(t => t.substation === substationId);
    const operational = substationTransformers.filter(t => t.serviceState === 'OK').length;
    const errors = substationTransformers.filter(t => t.serviceState === 'ERR').length;
    return { operational, errors };
  }, [transformers]);

  const filteredSubstations = useMemo(() => 
    substations.filter((substation) => 
      substation.name && substation.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [substations, searchTerm]);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const response = await axiosInstance.post('/substations/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);
        // Refresh the substation list after successful upload
        fetchSubstations();
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('An error occurred while uploading the file.');
      }
    }
  };

  if (loading) {
    return <div className={style.loading}>Đang tải danh sách trạm biến áp...</div>;
  }

  if (error) {
    return <div className={style.error}>Lỗi khi tải dữ liệu: {error.message}</div>;
  }

  return (
    <div className={style.substationList}>
      <h1>Danh sách trạm biến áp</h1>
      
      {user && user.role === 'admin' && (
        <div className={style.adminControls}>
          <button onClick={toggleAddForm} className={style.addButton}>
            {showAddForm ? 'Hủy' : 'Thêm trạm biến áp mới'}
          </button>
          <input
            type="file"
            accept=".csv, .json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <label htmlFor="fileInput" className={style.uploadButton}>
            Upload CSV/JSON
          </label>
        </div>
      )}

      {showAddForm && <AddSubstationForm onClose={toggleAddForm} />}

      <div className={style.searchContainer}>
        <FaSearch className={style.searchIcon} />
        <input 
          type="text" 
          placeholder="Tìm kiếm trạm biến áp..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className={style.searchInput}
        />
      </div>

      <div className={style.listContainer}>
        {filteredSubstations.length === 0 ? (
          <div className={style.noResults}>Không tìm thấy kết quả phù hợp</div>
        ) : (
          <ul className={style.substationsList}>
            {filteredSubstations.map((substation) => {
              const { operational, errors } = getTransformerStats(substation._id);
              return (
                <li 
                  key={substation._id} 
                  onClick={() => handleSubstationClick(substation._id)}
                  className={style.substationItem}
                >
                  {substation.name}
                  <span className={style.transformerStats}>
                    (OK: {operational}, ERR: {errors})
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedSubstation && (
        <div className={style.modalOverlay} onClick={handleCloseModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết trạm biến áp</h2>
            {detailsLoading ? (
              <div className={style.modalLoading}>
                <div className={style.spinner}></div>
                <p>Đang tải thông tin...</p>
              </div>
            ) : (
              <>
                <p><strong>Tên:</strong> {selectedSubstation.name}</p>
                <p><strong>ID:</strong> {selectedSubstation._id}</p>
                {/* Add more substation details here */}
              </>
            )}
            <button className={style.cancelButton} onClick={handleCloseModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubstationsList;