import { reqWeeklyInfo } from '@src/api';
import React, { useState, useEffect } from 'react';

import { WeeklyContext } from './weekly-context-manager';
import { WeeklyInfo } from './weekly.type';
import IncreaseRank from './IncreaseRank';

const Weekly = () => {
    const [weeklyContext, setWeeklyContext] = useState({} as WeeklyInfo);

    // 获取 weeklyInfo
    useEffect(() => {
        async function getWeeklyInfo() {
            const weeklyInfo: WeeklyInfo = await reqWeeklyInfo();
            console.log('weekly:', weeklyInfo);
            setWeeklyContext(weeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    return (
        <WeeklyContext.Provider value={weeklyContext}>
            <div>Weekly</div>
            <IncreaseRank />
        </WeeklyContext.Provider>
    );
};

export default Weekly;
