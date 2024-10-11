import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../AuthContext';
import style from './TransformerList.module.css';

function AddTransformerForm({ onClose, onTransformerAdded }) {
  const [formData, setFormData] = useState({
    transformerId: '',
    area: '',
    substation: '',
    ratedVoltage: '',
    monitorType: '',
    name: '',
    serialnumber: '',
    alarmState: 'Normal',
    serviceState: 'OK',
    transformerManufacturer: '',
    rating: '',
  });
  const [substations, setSubstations] = useState([]);
  const [error, setError] = useState('');
  const { axiosInstance } = useAuth();

  useEffect(() => {
    const fetchSubstations = async () => {
      try {
        const response = await axiosInstance.get('/substations');
        setSubstations(response.data);
      } catch (error) {
        console.error('Error fetching substations:', error);
        setError('Failed to fetch substations');
      }
    };
    fetchSubstations();
  }, [axiosInstance]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('/transformers', formData);
      onTransformerAdded(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while adding the transformer.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.addForm}>
      <input
        type="text"
        name="transformerId"
        value={formData.transformerId}
        onChange={handleChange}
        placeholder="Transformer ID"
        required
      />
      <input
        type="text"
        name="area"
        value={formData.area}
        onChange={handleChange}
        placeholder="Area"
      />
      <select
        name="substation"
        value={formData.substation}
        onChange={handleChange}
        required
      >
        <option value="">Select Substation</option>
        {substations.map((substation) => (
          <option key={substation._id} value={substation._id}>
            {substation.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="ratedVoltage"
        value={formData.ratedVoltage}
        onChange={handleChange}
        placeholder="Rated Voltage"
      />
      <input
        type="text"
        name="monitorType"
        value={formData.monitorType}
        onChange={handleChange}
        placeholder="Monitor Type"
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="serialnumber"
        value={formData.serialnumber}
        onChange={handleChange}
        placeholder="Serial Number"
      />
      <input
        type="text"
        name="transformerManufacturer"
        value={formData.transformerManufacturer}
        onChange={handleChange}
        placeholder="Transformer Manufacturer"
      />
      <input
        type="number"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        placeholder="Rating"
      />
      {error && <p className={style.error}>{error}</p>}
      <button type="submit">Add Transformer</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
}

export default AddTransformerForm;
