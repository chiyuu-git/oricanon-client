import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import React, { useState, useEffect, useContext } from 'react';
import { WeeklyContext } from '../weekly-context-manager';

import NestPie from './NestPie';

const BasicProjectPie = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [
        weeklyInfo,
        setWeeklyInfo,
    ] = useState<RecordWeeklyInfo<BasicType.character> | null>(null);
    const charaPixivIllustWeeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.illust];

    useEffect(() => {
        if (charaPixivIllustWeeklyInfo) {
            setWeeklyInfo(charaPixivIllustWeeklyInfo);
        }
    }, [charaPixivIllustWeeklyInfo]);

    if (weeklyInfo) {
        const { range, projectInfoList: projectInfo, memberInfoList: memberInfo } = weeklyInfo;
        return (
            <NestPie
                title = 'pixiv-illust-企划周增榜'
                range = { range }
                projectInfoList = { projectInfo }
                memberInfoList = { memberInfo }
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
