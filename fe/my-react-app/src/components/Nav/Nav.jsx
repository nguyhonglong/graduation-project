import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import style from './Nav.module.css';

function Nav() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className={style.container}>
            <ul className={style.linkul}>
                <li className={style.link}><Link to="/tong-quan">Tổng quan</Link></li>
                <li className={style.link}><Link to="/bieu-do">Xem dạng biểu đồ</Link></li>
                <li className={style.link}><Link to="/bang">Xem dữ liệu dạng bảng</Link></li>
                <li className={style.link}><Link to="/dga">DGA</Link></li>
                <li className={style.link}><Link to="/tram-bien-ap">Trạm biến áp</Link></li>
                <li className={style.link}><Link to="/may-bien-ap">Máy biến áp</Link></li>
                {user && user.role === 'admin' && (
                    <>
                        <li className={style.link}><Link to="/quan-ly-nguoi-dung">Quản lý người dùng</Link></li>
                        <li className={style.link}><Link to="/settings">Cài đặt</Link></li>
                        <li className={style.link}><Link to="/nhap-xuat-du-lieu">Xuất/Nhập dữ liệu</Link></li>
                        <li className={style.link}><Link to="/phan-tich-nang-cao">Phân tích nâng cao</Link></li>
                    </>
                )}
                <li className={style.link}><Link to="/update-and-maintainer">Update and maintainer</Link></li>
            </ul>
            <button className={style.logoutButton} onClick={handleLogout}>Đăng xuất</button>
        </nav>
    );
}

export default Nav;
