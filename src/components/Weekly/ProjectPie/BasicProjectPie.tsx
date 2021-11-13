import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import React, { useState, useEffect, useContext } from 'react';
import { WeeklyContext } from '../weekly-context-manager';

import NestPie from './NestPie';

const BasicProjectPie = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [
        charaIllustWeeklyInfo,
        setCharaIllustWeeklyInfo,
    ] = useState<RecordWeeklyInfo<BasicType.character> | null>(null);
    const pixivIllustWeeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.illust];

    useEffect(() => {
        if (pixivIllustWeeklyInfo) {
            setCharaIllustWeeklyInfo(pixivIllustWeeklyInfo);
        }
    }, [pixivIllustWeeklyInfo]);

    if (charaIllustWeeklyInfo) {
        const { range, projectInfo, memberInfo } = charaIllustWeeklyInfo;
        return (
            <NestPie
                title = 'pixiv标签创作数-企划周增榜'
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
