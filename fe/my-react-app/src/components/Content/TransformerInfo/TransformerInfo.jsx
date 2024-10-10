import React from 'react';
import style from './TransformerInfo.module.css';

function TransformerInfo({ currentTransformer }) {
  if (!currentTransformer) {
    return <div className={style.noTransformer}>No transformer selected</div>;
  }

  const getStateClassName = (state) => {
    return state && typeof state === 'string' ? style[state.toLowerCase()] : '';
  };

  return (
    <div className={style.transformerInfo}>
      <h2>{currentTransformer.name}</h2>
      <div className={style.infoGrid}>
        <div className={style.infoItem}>
          <span className={style.label}>ID:</span>
          <span className={style.value}>{currentTransformer.transformerId}</span>
        </div>
        <div className={style.infoItem}>
          <span className={style.label}>Area:</span>
          <span className={style.value}>{currentTransformer.area}</span>
        </div>
        <div className={style.infoItem}>
          <span className={style.label}>Alarm State:</span>
          <span className={`${style.value} ${getStateClassName(currentTransformer.alarmState)}`}>
            {currentTransformer.alarmState || 'N/A'}
          </span>
        </div>
        <div className={style.infoItem}>
          <span className={style.label}>Service State:</span>
          <span className={`${style.value} ${getStateClassName(currentTransformer.serviceState)}`}>
            {currentTransformer.serviceState || 'N/A'}
          </span>
        </div>
        <div className={style.infoItem}>
          <span className={style.label}>Manufacturer:</span>
          <span className={style.value}>{currentTransformer.transformerManufacturer || 'N/A'}</span>
        </div>
        <div className={style.infoItem}>
          <span className={style.label}>Rated Voltage:</span>
          <span className={style.value}>{currentTransformer.ratedVoltage || 'N/A'}</span>
        </div>
        <div className={style.infoItem}>
          <span className={style.label}>Monitor Type:</span>
          <span className={style.value}>{currentTransformer.monitorType || 'N/A'}</span>
        </div>
        <div className={style.infoItem}>
          <span className={style.label}>Serial Number:</span>
          <span className={style.value}>{currentTransformer.serialnumber || 'N/A'}</span>
        </div>
        <div className={style.infoItem}>
          <span className={style.label}>Rating:</span>
          <span className={style.value}>{currentTransformer.rating || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}

export default TransformerInfo;