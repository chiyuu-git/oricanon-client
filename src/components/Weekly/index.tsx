import { reqWeeklyInfo } from '@src/api';
import React, { useState, useEffect } from 'react';

import { WeeklyContext } from './weekly-context-manager';
import { WeeklyInfo } from './weekly.type';
import CoupleCircle from './CoupleCircle';
import PixivIllustIncreaseRank from './IncreaseRank/PixivIllustIncreaseRank';
import TwitterFollowerIncreaseRank from './IncreaseRank/TwitterFollowerIncreaseRank';
import PixivIllustTotalRank from './TotalRank/PixivIllustTotalRank';
import TwitterFollowerTotalRank from './TotalRank/TwitterFollowerTotalRank';
import BasicProjectPie from './ProjectPie/BasicProjectPie';
import CompareProjectPie from './ProjectPie/CompareProjectPie';

import './index.less';

const Weekly = () => {
    const [weeklyContext, setWeeklyContext] = useState<WeeklyInfo | null>(null);

    // 获取 weeklyInfo
    // useEffect(() => {
    //     async function getWeeklyInfo() {
    //         const weeklyInfo: WeeklyInfo = await reqWeeklyInfo();
    //         console.log('weeklyContext:', weeklyInfo);
    //         setWeeklyContext(weeklyInfo);
    //     }
    //     getWeeklyInfo();
    // }, []);

    // <WeeklyContext.Provider value = { weeklyContext }>
    // </WeeklyContext.Provider>
    return (
        <div className = 'weekly-wrap'>
            <PixivIllustIncreaseRank />
            { /* <div className = 'compare-pie-container'>
                <BasicProjectPie />
                <CompareProjectPie />
            </div>
            <PixivIllustTotalRank />
            <CoupleCircle />
            <TwitterFollowerIncreaseRank />
            <TwitterFollowerTotalRank />
            <BasicProjectPie /> */ }
        </div>
    );
};

export default Weekly;
