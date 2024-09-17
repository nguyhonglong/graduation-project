import { useState, useEffect } from 'react'
import style from './Transformer.module.css'
import axios from 'axios'

function Transformer({ setCurrentTransformer }) {
    const [substations, setSubstations] = useState([]);
    const [transformers, setTransformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/v1/transformers')
            .then(response => {
                setTransformers(response.data);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

        axios.get('http://localhost:3000/v1/substations')
            .then(response => {
                setSubstations(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

    }, []);

    if (loading) {
        return <div className={style.transformer}>
            Đang tải các trạm...
        </div>
    }

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }
    const handleSetCurrentTransformer = (transformer) => {
        setCurrentTransformer(transformer)
    }


    return (
        <div className={style.transformer}>
            {substations.map((substation) => (
                <div>
                    <div
                        className={style.substationoption} key={substation._id}>{substation.name}
                    </div>
                    {transformers.map((transformer) => (
                        transformer.substation == substation._id ? <div className={style.transformeroption} onClick={() => handleSetCurrentTransformer(transformer)}>{transformer.name}</div> : null
                    ))}
                </div>

            ))}
        </div>
    )

}

export default Transformer;