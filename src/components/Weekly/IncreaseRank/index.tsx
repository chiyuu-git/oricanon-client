import React, { createContext, useState, useEffect, useContext } from 'react';

import { WeeklyContext } from '../weekly-context-manager';

const IncreaseRank = () => {
    const weeklyInfo = useContext(WeeklyContext);
    // 获取 weeklyInfo
    useEffect(() => {
        console.log('increaseRank:', weeklyInfo);
    }, [weeklyInfo]);

    return (
        <div>increase</div>
    );
};

export default IncreaseRank;
