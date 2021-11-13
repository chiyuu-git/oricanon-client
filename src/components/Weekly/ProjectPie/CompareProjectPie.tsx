import React, { useState, useEffect } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { reqRecordWeeklyInfo } from '@src/api';

import NestPie from './NestPie';

const CompareProjectPie = () => {
    const [
        charaIllustWeeklyInfo,
        setCharaIllustWeeklyInfo,
    ] = useState<RecordWeeklyInfo<BasicType.character> | null>(null);

    useEffect(() => {
        async function getWeeklyInfo() {
            const illustWeeklyInfo = await reqRecordWeeklyInfo(
                BasicType.character,
                CharacterRecordType.illust,
                '2021-01-08',
            );

            setCharaIllustWeeklyInfo(illustWeeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    if (charaIllustWeeklyInfo) {
        const { range, projectInfo, memberInfo } = charaIllustWeeklyInfo;

        return (
            <NestPie
                title = '创作数对比-企划周增榜'
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
