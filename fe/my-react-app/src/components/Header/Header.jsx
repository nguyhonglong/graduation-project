import React from 'react'
import { useAuth } from '../../AuthContext'
import { FaBell, FaCog } from 'react-icons/fa'
import logo from '../../assets/Logoevnngangfull.png'
import style from './Header.module.css'

function Header() {
  const { user } = useAuth()

  return (
    <div className={style.bg}>
      <img src={logo} alt="logoEVN" className={style.logo} />
      <div className={style.rightContent}>
        <div className={style.greeting}>Xin chào, {user ? user.name : 'Guest'}!</div>
        <button className={style.iconButton}>
          <FaBell />
        </button>
        <button className={style.iconButton}>
          <FaCog />
        </button>
      </div>
    </div>
  )
}

export default Header;
