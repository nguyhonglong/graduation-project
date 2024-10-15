import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../AuthContext';
import style from './SubstationList.module.css';
import { FaSearch, FaTimes } from 'react-icons/fa';
import AddSubstationForm from './AddSubstationForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubstation, setNewSubstation] = useState({ substationId: '', name: '' });

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
    setNewSubstation({ substationId: '', name: '' });
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
    const total = substationTransformers.length;
    const operationalPercentage = total > 0 ? (operational / total) * 100 : 0;
    const errorsPercentage = total > 0 ? (errors / total) * 100 : 0;
    return { operational, errors, operationalPercentage, errorsPercentage };
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

  const handleAddSubstation = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/substations', newSubstation);
      setSubstations([...substations, response.data]);
      toggleAddModal();
      toast.success('Trạm biến áp đã được thêm thành công');
    } catch (error) {
      console.error('Error adding substation:', error);
      toast.error('Không thể thêm trạm biến áp');
    }
  };

  const PieChart = ({ operational, errors }) => {
    const total = operational + errors;
    const operationalAngle = (operational / total) * 360;
    const errorsAngle = (errors / total) * 360;

    return (
      <svg width="24" height="24" viewBox="0 0 24 24" className={style.pieChart}>
        {total > 0 ? (
          <>
            <circle cx="12" cy="12" r="10" fill="#4CAF50" />
            <path
              d={`M12 2 A10 10 0 ${errorsAngle > 180 ? 1 : 0} 1 ${
                12 + 10 * Math.sin(errorsAngle * Math.PI / 180)
              } ${
                12 - 10 * Math.cos(errorsAngle * Math.PI / 180)
              } L 12 12`}
              fill="#F44336"
            />
          </>
        ) : (
          <circle cx="12" cy="12" r="10" fill="#ccc" />
        )}
      </svg>
    );
  };

  if (loading) {
    return <div className={style.loading}><FaSpinner className={style.spinner} /></div>;
  }

  if (error) {
    return <div className={style.error}>Lỗi khi tải dữ liệu: {error.message}</div>;
  }

  return (
    <div className={style.substationList}>
      <ToastContainer />
      <h1>Danh sách trạm biến áp</h1>



      {/* Add Substation Modal */}
      {showAddModal && (
        <div className={style.modalOverlay} onClick={toggleAddModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeButton} onClick={toggleAddModal}>
              <FaTimes />
            </button>
            <h2>Thêm trạm biến áp mới</h2>
            <form onSubmit={handleAddSubstation}>
              <input
                type="text"
                placeholder="Tên trạm biến áp"
                value={newSubstation.substationId}
                onChange={(e) => setNewSubstation({ ...newSubstation, substationId: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Tên Trạm"
                value={newSubstation.name}
                onChange={(e) => setNewSubstation({ ...newSubstation, name: e.target.value })}
                required
              />
              <div className={style.modalButtons}>
                <button type="submit">Thêm</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <div className={style.transformerStats}>
                    <PieChart operational={operational} errors={errors} />
                    <span className={style.statsText}>
                      (OK: {operational}, ERR: {errors})
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        
      </div>
      {user && user.role === 'admin' && (
        <div className={style.adminControls}>
          {/* Add a container for the buttons */}
          <div className={style.buttonContainer}>
            <button onClick={toggleAddModal} className={style.addButton}>
              Thêm trạm biến áp mới
            </button>
            <input
              type="file"
              accept=".csv, .json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="fileInput"
            />
            {/* Change from label to button for consistency */}
            <button onClick={() => document.getElementById('fileInput').click()} className={style.uploadButton}>
              Upload CSV/JSON
            </button>
          </div>
        </div>
      )}

      {selectedSubstation && (
        <div className={style.modalOverlay} onClick={handleCloseModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết trạm biến áp</h2>
            {detailsLoading ? (
              <div className={style.modalLoading}>
                <FaSpinner className={style.spinner} />
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

      {showAddForm && <AddSubstationForm onClose={toggleAddForm} />}

    </div>

  );
}

export default SubstationsList;
