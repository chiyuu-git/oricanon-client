import { reqWeeklyInfo } from '@src/api';
import React, { createContext, useState, useEffect } from 'react';
import { ModuleInfo } from '@chiyu-bit/canon.weekly';

export const WeeklyContext = createContext({});

const Weekly = () => {
    const [weeklyContext, setWeeklyContext] = useState(null);

    // 获取 weeklyInfo
    useEffect(() => {
        async function getWeeklyInfo() {
            const weeklyInfo = await reqWeeklyInfo();
            console.log('weeklyInfo:', weeklyInfo);
            setWeeklyContext(weeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    return (
        <WeeklyContext.Provider value={{ weeklyContext }}>
            <div>Weekly</div>
        </WeeklyContext.Provider>
    );
};

export default Weekly;
