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
                <li className={style.link}><Link to="/bieu-do">Biểu đồ</Link></li>
                <li className={style.link}><Link to="/bang">Bảng</Link></li>
                <li className={style.link}><Link to="/tram-bien-ap">Trạm biến áp</Link></li>
                {user && user.role === 'admin' && (
                    <>
                        <li className={style.link}><Link to="/user-management">Quản lý người dùng</Link></li>
                        <li className={style.link}><Link to="/settings">Cài đặt</Link></li>
                    </>
                )}
            </ul>
            <button className={style.logoutButton} onClick={handleLogout}>Đăng xuất</button>
        </nav>
    );
}

export default Nav;
