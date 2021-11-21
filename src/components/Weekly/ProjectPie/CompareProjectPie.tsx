import React, { useState, useEffect } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { reqInfoTypeWeekly } from '@src/api';

import NestPie from './NestPie';

const CompareProjectPie = () => {
    const [
        weeklyInfo,
        setWeeklyInfo,
    ] = useState<RecordWeeklyInfo<BasicType.character> | null>(null);

    useEffect(() => {
        async function getWeeklyInfo() {
            const charaPixivIllustWeeklyInfo = await reqInfoTypeWeekly(
                BasicType.character,
                CharacterRecordType.illust,
                '2021-01-08',
            );

            setWeeklyInfo(charaPixivIllustWeeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    if (weeklyInfo) {
        const { range, projectInfoList: projectInfo, memberInfoList: memberInfo } = weeklyInfo;

        return (
            <NestPie
                title = '创作数对比-企划周增榜'
                range = { range }
                projectInfoList = { projectInfo }
                memberInfoList = { memberInfo }
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
