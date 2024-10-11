import React, { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import style from './SubstationList.module.css';

function AddSubstationForm({ onClose }) {
  const [substationId, setSubstationId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { axiosInstance } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axiosInstance.post('/substations', { substationId, name });
      onClose();
      // You might want to refresh the substation list here
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while adding the substation.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.addForm}>
      <input
        type="text"
        value={substationId}
        onChange={(e) => setSubstationId(e.target.value)}
        placeholder="Substation ID"
        required
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Substation Name"
        required
      />
      {error && <p className={style.error}>{error}</p>}
      <button type="submit">Add Substation</button>
    </form>
  );
}

export default AddSubstationForm;
