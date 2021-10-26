import { BasicType, RecordType } from '@chiyu-bit/canon.root';
import { reqWeeklyInfoOfRecordType, WeeklyInfo } from '@src/api';
import React, { useState, useEffect } from 'react';

import NestPie from './NestPie';

const BasicProjectPie = () => {
    const [
        characterIllustWeeklyInfo,
        setCharacterIllustWeeklyInfo,
    ] = useState<WeeklyInfo<BasicType.character> | null>(null);

    useEffect(() => {
        async function getWeeklyInfo() {
            const illustWeeklyInfo = await reqWeeklyInfoOfRecordType({
                basicType: BasicType.character,
                recordType: RecordType.illust,
            });

            setCharacterIllustWeeklyInfo(illustWeeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    if (characterIllustWeeklyInfo) {
        const { range, recordWeekInfo } = characterIllustWeeklyInfo;
        const { projectInfo, memberInfo } = recordWeekInfo;
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
