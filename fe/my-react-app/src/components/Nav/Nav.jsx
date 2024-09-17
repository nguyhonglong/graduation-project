import { BrowserRouter as Router, Link } from 'react-router-dom';
import style from './Nav.module.css'
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authServices';
import React from 'react';
function Nav() {
    const navigate = useNavigate();

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
                        <li className={style.link}>
                            <Link to="/">Tổng quan</Link>
                        </li>
                        <li className={style.link}>
                            <Link to="/bieu-do">Biểu đồ</Link>
                        </li>
                        <li className={style.link}>
                            <Link to="/bang">Bảng</Link>
                        </li>
                        <li className={style.link}>
                            <Link to="/dga">DGA</Link>
                        </li>
                        <li className={style.link}>
                            <Link to="/tram-bien-ap">Trạm biến áp</Link>
                        </li>
                        <li className={style.link}>
                            <Link to="/bao-cao">Báo cáo</Link>
                        </li>
                        <button onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}>Logout</button>
                    </ul>
                </nav>
            </div>

        </div>
    )
}
export default Nav