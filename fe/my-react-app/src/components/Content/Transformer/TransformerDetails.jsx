import React from 'react';
import style from './TransformerDetails.module.css'; // Tạo file CSS cho styling

function TransformerDetails({ transformer }) {
    if (!transformer) {
        return <div className={style.details}>Vui lòng chọn một transformer để xem thông tin.</div>;
    }
    console.log(transformer)
    return (
        <div className={style.details}>
            <h2>Thông tin máy biến áp</h2>
            <p><strong>Tên:</strong> {transformer.name}</p>
            <p><strong>ID:</strong> {transformer._id}</p>
            <p><strong>Mã trạm:</strong> {transformer.substation}</p>
            <p><strong>Công suất:</strong> {transformer.ratedVoltage}</p>
            {/* Thêm các thông tin khác nếu cần */}
        </div>
    );
}

export default TransformerDetails;
