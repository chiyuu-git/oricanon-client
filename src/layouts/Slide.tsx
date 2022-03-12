import React, { useState, createContext } from 'react';

export const ConnectionContext = createContext({});

const Slide = () => {
    const [context, setContext] = useState(null);

    return (
        <ConnectionContext.Provider value = {{ context, setContext }}>
            <section className = 'candidate_box'>
                <div className = 'candidate_body' />
            </section>
        </ConnectionContext.Provider>
    );
};

export default Slide;
