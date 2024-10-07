import { useState, useEffect } from 'react';
import style from './Transformer.module.css';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

function Transformer({ setCurrentTransformer, currentTransformer }) {
    const [substations, setSubstations] = useState([]);
    const [transformers, setTransformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubstation, setSelectedSubstation] = useState(null);
    const [collapsedSubstations, setCollapsedSubstations] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const { axiosInstance } = useAuth();

    useEffect(() => {
        axiosInstance.get('/transformers')
            .then(response => {
                setTransformers(response.data);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

        axiosInstance.get('/substations')
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
        return <div className={style.transformer}>Đang tải các trạm...</div>;
    }

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }

    const handleSetCurrentTransformer = (transformer) => {
        setCurrentTransformer(transformer);
    };

    const handleToggleSubstation = (substationId) => {
        setCollapsedSubstations((prev) => ({
            ...prev,
            [substationId]: !prev[substationId]
        }));
        setSelectedSubstation(substationId);
    };

    const filteredSubstations = substations.filter((substation) => 
        substation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTransformers = transformers.filter((transformer) => 
        transformer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={style.transformer}>
            <input 
                type="text" 
                placeholder="Tìm kiếm trạm biến áp..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className={style.searchInput}
            />
            
            {filteredSubstations.map((substation) => (
                <div key={substation._id}>
                    <div
                        className={`${style.substationoption} ${selectedSubstation === substation._id ? style.selected : ''}`}
                        onClick={() => handleToggleSubstation(substation._id)}
                    >
                        {substation.name}
                    </div>

                    {!collapsedSubstations[substation._id] && (
                        <div className={style.transformerlist}>
                            {filteredTransformers.map((transformer) => (
                                transformer.substation === substation._id ? (
                                    <div
                                        key={transformer._id}
                                        className={`${style.transformeroption} ${currentTransformer?._id === transformer._id ? style.selected : ''}`}
                                        onClick={() => handleSetCurrentTransformer(transformer)}
                                    >
                                        {transformer.name}
                                    </div>
                                ) : null
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Transformer;