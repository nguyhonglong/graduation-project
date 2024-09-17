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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>

  )
}

export default App
