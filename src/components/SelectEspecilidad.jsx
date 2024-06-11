'use client';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import LineChart from './LineChart';

export default function SelectEspecialidad() {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [triggerRender, setTriggerRender] = useState(0);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/getespecialidad');
                const data_response = await response.json();
                const formattedOptions = data_response.map(especialidad => ({
                    value: especialidad,
                    label: especialidad
                }));

                setOptions([{value: '',label:"Todos"}, ...formattedOptions]);
                setIsLoading(false); 
            } catch (error) {
                console.log(error);
                setIsLoading(false); 
            }
        }
        fetchData();
    }, []);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setTriggerRender(prev => prev + 1);
        console.log('Opción seleccionada:', selectedOption);
    };
    if (isLoading) {
        return <div>Loading...</div>; 
    }
    return (
        <div className='row'>
            
            <div className='col-10'>
                <LineChart key={triggerRender}  especialidad={selectedOption} ></LineChart>
            </div>  
            <div className='col-2'>
            <div className='mb-3'>
                <label htmlFor="">Filtro Especialidad</label>
                <Select 
                    options={options}
                    value={selectedOption}
                    onChange={handleChange}
                />
            </div>               
        </div>      
        </div>           
    );
}
