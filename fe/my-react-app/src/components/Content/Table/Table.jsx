import { useState, useEffect } from "react"
import axios from "axios";
import style from './Table.module.css'

function Table({ currentTransformer }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(currentMonthStart.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    console.log(currentTransformer)
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
        return <p>Chọn một trạm...</p>;
    }

    if (loading) {
        return <div >
            Đang tải dữ liệu bảng...
        </div>
    }

    console.log(data)
    return (
        <div className={style.tablecontainer}>
            <h1>{currentTransformer.name}</h1>
            <div className={style.choosedate}>
                <label className={style}>
                    Start Date:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label className={style}>
                    End Date:
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
            </div>
            <div >
                    <table className={style}>
                        <tr>
                            <th>Acetylene</th>
                            <th>CO</th>
                            <th>CO2</th>
                            <th>Ethane</th>
                            <th>Ethylene</th>
                            <th>Hydrogen</th>
                            <th>Methane</th>
                            <th>O2</th>
                            <th>TDCG</th>
                            <th>Water</th>
                            <th>Ngày</th>
                        </tr>
                        {data.map((data) => (
                            <tr key={data.id}>
                                <td>{data.Acetylene}</td>
                                <td>{data.CO}</td>
                                <td>{data.CO2}</td>
                                <td>{data.Ethane}</td>
                                <td>{data.Ethylene}</td>
                                <td>{data.Hydrogen}</td>
                                <td>{data.Methane}</td>
                                <td>{data.O2}</td>
                                <td>{data.TDCG}</td>
                                <td>{data.Water}</td>
                                <td>{data.createdAt.split('T')[0]}</td>
                            </tr>
                        ))}
                    </table>
            </div>
        </div>
    )
}

export default Table