import React, { useContext } from 'react';

import { WeeklyContext } from '../weekly-context-manager';
import NestPie from './NestPie';

const BasicProjectPie = () => {
    const weeklyInfo = useContext(WeeklyContext);

    if (weeklyInfo) {
        const { range, characterInfo } = weeklyInfo;
        const { projectInfo, memberInfo } = characterInfo;

        return (
            <NestPie
                title = 'pixiv标签-企划周增榜'
                range = { range }
                projectInfo = { projectInfo }
                memberInfo = { memberInfo }
                showWidget
                size = { {
                    width: '800px',
                    height: '800px',
                } }
            />
        );
    }

    return <div>BasicProjectPie</div>;
};

export default BasicProjectPie;
