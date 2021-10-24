import React, { useState, useEffect } from 'react';
import { reqWeeklyInfo } from '@src/api';
import { WeeklyInfo } from '../weekly.type';

import NestPie from './NestPie';

const CompareProjectPie = () => {
    const [compareWeeklyInfo, setCompareWeeklyInfo] = useState<WeeklyInfo | null>(null);

    // 获取 weeklyInfo
    useEffect(() => {
        async function getWeeklyInfo() {
            const weeklyInfo: WeeklyInfo = await reqWeeklyInfo('2021-01-01');
            console.log('compareWeeklyInfo:', weeklyInfo);
            setCompareWeeklyInfo(weeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    if (compareWeeklyInfo) {
        const { range, characterInfo } = compareWeeklyInfo;
        const { projectInfo, memberInfo } = characterInfo;

        return (
            <NestPie
                title = '同期对比-企划周增榜'
                range = { range }
                projectInfo = { projectInfo }
                memberInfo = { memberInfo }
                showWidget = { false }
                size = { {
                    width: '640px',
                    height: '640px',
                } }
            />
        );
    }

    return <div>CompareProjectPie</div>;
};

export default CompareProjectPie;
