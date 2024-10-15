import React, { useState } from 'react';
import style from './AddTransformerForm.module.css';

function AddTransformerForm({ onTransformerAdded, onCancel, axiosInstance }) {
  const [name, setName] = useState('');
  const [serviceState, setServiceState] = useState('OK');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/transformers', { name, serviceState });
      onTransformerAdded(response.data);
    } catch (error) {
      console.error('Error adding transformer:', error);
    }
  };

  return (
    <div className={style.formOverlay}>
      <div className={style.formContainer}>
        <h2>Thêm máy biến áp mới</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên máy biến áp"
            required
          />
          <select
            value={serviceState}
            onChange={(e) => setServiceState(e.target.value)}
          >
            <option value="OK">OK</option>
            <option value="NOT OK">NOT OK</option>
          </select>
          <div className={style.buttonGroup}>
            <button type="submit">Thêm</button>
            <button type="button" onClick={onCancel}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransformerForm;
