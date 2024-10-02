import { useState } from 'react'
import style from './App.module.css'
import Header from './components/Header/Header'
import Nav from './components/Nav/Nav'
import Chart from './components/Content/Chart/Chart'
import Table from './components/Content/Table/Table'
import Transformer from './components/Transformer/Transformer'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import { useNavigate } from 'react-router-dom';
import authService from './services/authServices';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  const [currentTransformer, setCurrentTransformer] = useState(null);
  return (
    <div>

      <Router>
        <Header />
        <div className={style.display}>
          <Nav />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/bieu-do" element={<Chart />} />
            <Route path="/bang" element={<Table />} />
          </Routes>
        </div>

      </Router>
    </div>


  )
}

export default App
