import { reqWeeklyInfo } from '@src/api';
import React, { useState, useEffect } from 'react';

import { WeeklyContext } from './weekly-context-manager';
import { WeeklyInfo } from './weekly.type';
import CoupleCircle from './CoupleCircle';
import PixivIllustIncreaseRank from './IncreaseRank/PixivIllustContainer';
import TwitterFollowerIncreaseRank from './IncreaseRank/SeiyuuFollowerContainer';

const Weekly = () => {
    const [weeklyContext, setWeeklyContext] = useState<WeeklyInfo | null>(null);

    // 获取 weeklyInfo
    useEffect(() => {
        async function getWeeklyInfo() {
            const weeklyInfo: WeeklyInfo = await reqWeeklyInfo();
            console.log('weeklyContext:', weeklyInfo);
            setWeeklyContext(weeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    return (
        <WeeklyContext.Provider value = { weeklyContext }>
            <div>Weekly</div>
            <PixivIllustIncreaseRank />
            <TwitterFollowerIncreaseRank />
            <CoupleCircle />
        </WeeklyContext.Provider>
    );
};

export default Weekly;
