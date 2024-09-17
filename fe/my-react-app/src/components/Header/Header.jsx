import React from 'react'
import logo from '../../assets/Logoevnngangfull.png'
import style from './Header.module.css'
function Header() {
  return (
      <div className={style.bg}>
        <img src={logo} alt="logoEVN" className={style.logo}/>
        
      </div>
  )
}
export default Header;