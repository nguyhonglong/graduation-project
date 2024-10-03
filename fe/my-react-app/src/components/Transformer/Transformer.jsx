import { useState, useEffect } from 'react';
import style from './Transformer.module.css';
import axios from 'axios';
import TransformerDetails from '../Content/Transformer/TransformerDetails'; 

function Transformer({ setCurrentTransformer }) {
    const [substations, setSubstations] = useState([]);
    const [transformers, setTransformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubstation, setSelectedSubstation] = useState(null);
    const [selectedTransformer, setSelectedTransformer] = useState(null);
    const [collapsedSubstations, setCollapsedSubstations] = useState({});
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:3000/v1/transformers', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setTransformers(response.data);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

        axios.get('http://localhost:3000/v1/substations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
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
        setSelectedTransformer(transformer._id);
        setCurrentTransformer(transformer);
    };

    const handleToggleSubstation = (substationId) => {
        setCollapsedSubstations((prev) => ({
            ...prev,
            [substationId]: !prev[substationId]
        }));
        setSelectedSubstation(substationId);
    };


    // Lọc substations và transformers dựa trên searchTerm
    const filteredSubstations = substations.filter((substation) => 
        substation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTransformers = transformers.filter((transformer) => 
        transformer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={style.transformer}>
            {/* Ô tìm kiếm */}
            
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
                                        className={`${style.transformeroption} ${selectedTransformer === transformer._id ? style.selected : ''}`}
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
