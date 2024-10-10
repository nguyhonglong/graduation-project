import React, { useState, useEffect, useMemo, useCallback } from 'react';
import style from './Transformer.module.css';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { FaSearch, FaChevronDown, FaChevronRight } from 'react-icons/fa';

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
        const fetchData = async () => {
            try {
                const [transformersResponse, substationsResponse] = await Promise.all([
                    axiosInstance.get('/transformers'),
                    axiosInstance.get('/substations')
                ]);
                setTransformers(transformersResponse.data);
                setSubstations(substationsResponse.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosInstance]);

    const handleSetCurrentTransformer = useCallback((transformer) => {
        setCurrentTransformer(transformer);
    }, [setCurrentTransformer]);

    const handleToggleSubstation = useCallback((substationId) => {
        setCollapsedSubstations((prev) => ({
            ...prev,
            [substationId]: !prev[substationId]
        }));
        setSelectedSubstation(substationId);
    }, []);

    const filteredSubstations = useMemo(() => 
        substations.filter((substation) => 
            substation.name && substation.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [substations, searchTerm]);

    const filteredTransformers = useMemo(() => 
        transformers.filter((transformer) => 
            transformer.name && transformer.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [transformers, searchTerm]);

    if (loading) {
        return <div className={style.loading}>Đang tải các trạm...</div>;
    }

    if (error) {
        return <div className={style.error}>Lỗi khi tải dữ liệu: {error.message}</div>;
    }

    return (
        <div className={style.transformer}>
            <div className={style.searchContainer}>
                <FaSearch className={style.searchIcon} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm trạm biến áp..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className={style.searchInput}
                />
            </div>
            
            {filteredSubstations.length === 0 && filteredTransformers.length === 0 ? (
                <div className={style.noResults}>Không tìm thấy kết quả phù hợp</div>
            ) : (
                filteredSubstations.map((substation) => (
                    <div key={substation._id} className={style.substationContainer}>
                        <div
                            className={`${style.substationoption} ${selectedSubstation === substation._id ? style.selected : ''}`}
                            onClick={() => handleToggleSubstation(substation._id)}
                        >
                            {collapsedSubstations[substation._id] ? <FaChevronRight /> : <FaChevronDown />}
                            &nbsp;
                            <span>{substation.name}</span>
                        </div>

                        {!collapsedSubstations[substation._id] && (
                            <div className={style.transformerlist}>
                                {filteredTransformers
                                    .filter(transformer => transformer.substation === substation._id)
                                    .map((transformer) => (
                                        <div
                                            key={transformer._id}
                                            className={`${style.transformeroption} ${currentTransformer?._id === transformer._id ? style.selected : ''}`}
                                            onClick={() => handleSetCurrentTransformer(transformer)}
                                        >
                                            {transformer.name}
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default React.memo(Transformer);