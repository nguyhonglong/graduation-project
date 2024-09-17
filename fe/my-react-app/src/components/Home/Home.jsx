import React from 'react'
import Header from '../Header/Header'
import Nav from '../Nav/Nav'
import Transformer from '../Transformer/Transformer'
import Chart from '../Content/Chart/Chart'
import Table from '../Content/Table/Table'
import { useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";


export default function Home() {
    const [currentTransformer, setCurrentTransformer] = useState(null);
    return (
        <div>
            <Header />
            <Nav />
            <Routes>
                <Route path="/bieu-do" element={<Chart currentTransformer={currentTransformer} />} />
                <Route path="/bang" element={<Table currentTransformer={currentTransformer} />} />
            </Routes>

            <Transformer setCurrentTransformer={setCurrentTransformer} />
        </div>
    )
}
