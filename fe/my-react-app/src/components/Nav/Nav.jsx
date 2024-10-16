import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import style from './Nav.module.css';

function Nav() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={style.container}>
            <ul className={style.linkul}>
                <li className={`${style.link} ${isActive('/tong-quan') ? style.active : ''}`}><Link to="/tong-quan">Tổng quan</Link></li>
                <li className={`${style.link} ${isActive('/bieu-do') ? style.active : ''}`}><Link to="/bieu-do">Xem dạng biểu đồ</Link></li>
                <li className={`${style.link} ${isActive('/bang') ? style.active : ''}`}><Link to="/bang">Xem dữ liệu dạng bảng</Link></li>
                <li className={`${style.link} ${isActive('/dga') ? style.active : ''}`}><Link to="/dga">DGA</Link></li>
                <li className={`${style.link} ${isActive('/tram-bien-ap') ? style.active : ''}`}><Link to="/tram-bien-ap">Trạm biến áp</Link></li>
                <li className={`${style.link} ${isActive('/may-bien-ap') ? style.active : ''}`}><Link to="/may-bien-ap">Máy biến áp</Link></li>
                {user && user.role === 'admin' && (
                    <>
                        <li className={`${style.link} ${isActive('/quan-ly-nguoi-dung') ? style.active : ''}`}><Link to="/quan-ly-nguoi-dung">Quản lý người dùng</Link></li>
                        <li className={`${style.link} ${isActive('/nhap-xuat-du-lieu') ? style.active : ''}`}><Link to="/nhap-xuat-du-lieu">Xuất dữ liệu</Link></li>
                        <li className={`${style.link} ${isActive('/phan-tich-nang-cao') ? style.active : ''}`}><Link to="/phan-tich-nang-cao">Phân tích nâng cao</Link></li>
                    </>
                )}
                <li className={`${style.link} ${isActive('/update-and-maintainer') ? style.active : ''}`}><Link to="/update-and-maintainer">Báo lỗi và cập nhật</Link></li>
            </ul>
            <button className={style.logoutButton} onClick={handleLogout}>Đăng xuất</button>
        </nav>
    );
}

export default Nav;
