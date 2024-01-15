import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Fib() {
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');
    const [seenIndexes, setSeenIndexes] = useState([]);

    async function fetchValues(){        
        try {
            const { data } = await axios.get('/api/values/current');
            setValues(data);    
        } catch (err) {console.log(err)}
    }

    async function fetchIndexes() {
        try {
            const { data } = await axios.get('/api/values/all');
            setSeenIndexes(data);    
        } catch (err) {console.log(err)}
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await axios.post('/api/values', {
                index
            });
    
        } catch (err) {
            console.log(err);
        }

        setIndex('');    
    }

    useEffect(() => {
        fetchValues();
        fetchIndexes();
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter your index:
                </label>
                <input value={index} onChange={(e) => setIndex(e.target.value)}/>
                <button>Submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            <div>
                {
                    seenIndexes?.map(({ number }, index) => 
                        <span key={index}>{number},</span>
                    )
                }
            </div>

            <h3>Calculated Values</h3>
            <div>
                {
                    Object.entries(values).map((value, index) => 
                        <div key={index}>
                            {`For index${value[0]} I calculated ${value[1]}`}
                        </div>
                    )
                }
            </div>
        </div>
    )
}
