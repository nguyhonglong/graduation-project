import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import style from './Nav.module.css'
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authServices';
import React from 'react';

function Nav() {
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (!authService.isLoggedIn()) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className={style.container}>
            <div>
                <nav>
                    <ul className={style.linkul}>
                        <li className={`${style.link} ${location.pathname === '/' ? style.active : ''}`}>
                            <Link to="/">Tổng quan</Link>
                        </li>
                        <li className={`${style.link} ${location.pathname === '/bieu-do' ? style.active : ''}`}>
                            <Link to="/bieu-do">Biểu đồ</Link>
                        </li>
                        <li className={`${style.link} ${location.pathname === '/bang' ? style.active : ''}`}>
                            <Link to="/bang">Bảng</Link>
                        </li>
                        <li className={`${style.link} ${location.pathname === '/dga' ? style.active : ''}`}>
                            <Link to="/dga">DGA</Link>
                        </li>
                        <li className={`${style.link} ${location.pathname === '/tram-bien-ap' ? style.active : ''}`}>
                            <Link to="/tram-bien-ap">Trạm biến áp</Link>
                        </li>
                        <li className={`${style.link} ${location.pathname === '/bao-cao' ? style.active : ''}`}>
                            <Link to="/bao-cao">Báo cáo</Link>
                        </li>
                        <button onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}>Đăng xuất</button>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Nav;
