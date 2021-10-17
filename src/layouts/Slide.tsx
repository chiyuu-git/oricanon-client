import React, { useState, createContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

export const ConnectionContext = createContext({});

const Slide = () => {
    const [context, setContext] = useState(null);

    return (
        <ConnectionContext.Provider value={{ context, setContext }}>
            <section className='candidate_box'>
                <div className='candidate_body' />
            </section>
        </ConnectionContext.Provider>
    );
};

export default Slide;
