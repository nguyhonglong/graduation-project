import { useState, useEffect, memo } from "react"
import axios from "axios";
import style from './Chart.module.css'
import Transformer from '../../Transformer/Transformer'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Chart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(currentMonthStart.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    const [currentTransformer, setCurrentTransformer] = useState(null);
    const [activeLines, setActiveLines] = useState({
        Hydrogen: true,
        Methane: true,
        Acetylene: true,
        Ethylene: true,
        Ethane: true,
        TDCG: true,
        Water: true
    });
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setActiveLines(prevState => ({ ...prevState, [name]: checked }));
    };
    useEffect(() => {
        if (currentTransformer) {
            setLoading(true)
            axios.get(`http://localhost:3000/v1/indexes/${currentTransformer._id}?startDate=${startDate}&endDate=${endDate}`)
                .then(response => {
                    setData(response.data);
                    console.log(currentTransformer._id, response.data)
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [currentTransformer, startDate, endDate]);

    if (!currentTransformer) {
        return (<div className={style.contentcontainer}>
            <div className={style.chartcontainer}>
                <p>Chọn một trạm...</p>
            </div>

            <Transformer setCurrentTransformer={setCurrentTransformer} />
        </div>)
    }

    if (loading) {
        return (<div className={style.contentcontainer}>
            <div className={style.chartcontainer}>
                <p>Đang tải dữ liệu...</p>
            </div>

            <Transformer setCurrentTransformer={setCurrentTransformer} />
        </div>)
    }
    return (
        <div className={style.contentcontainer} >
            <div className={style.chartcontainer}>
                <h3 className={style.transformername} >{currentTransformer.name}</h3>
                <div className={style.choosedate}>
                    <label className={style}>
                        Ngày bắt đầu:
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </label>
                    <label className={style}>
                        Ngày kết thúc:
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </label>
                </div>
                <div>
                    <div className={style.checkboxes}>
                        {Object.keys(activeLines).map((key) => (
                            <label key={key}>
                                <input
                                    type="checkbox"
                                    name={key}
                                    checked={activeLines[key]}
                                    onChange={handleCheckboxChange}
                                />
                                &nbsp;
                                {key}
                            </label>
                        ))}
                    </div>
                    <div style={{ width: '100%', height: '60vh' }}> {/* Parent container with 100% width and fixed height */}
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                width={600}
                                height={300}
                                data={data}
                                margin={{
                                    top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="createdAt" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {activeLines.Hydrogen && <Line type="monotone" dataKey="Hydrogen" stroke="#8884d8" />}
                                {activeLines.Methane && <Line type="monotone" dataKey="Methane" stroke="#82ca9d" />}
                                {activeLines.Acetylene && <Line type="monotone" dataKey="Acetylene" stroke="#ffc658" />}
                                {activeLines.Ethylene && <Line type="monotone" dataKey="Ethylene" stroke="#ff7300" />}
                                {activeLines.Ethane && <Line type="monotone" dataKey="Ethane" stroke="#387908" />}
                                {activeLines.TDCG && <Line type="monotone" dataKey="TDCG" stroke="#ff0000" />}
                                {activeLines.Water && <Line type="monotone" dataKey="Water" stroke="#0000ff" />}
                            </LineChart>
                        </ResponsiveContainer>

                    </div>
                </div>


            </div>
            <Transformer setCurrentTransformer={setCurrentTransformer} />
        </div>
    )
}

export default Chart