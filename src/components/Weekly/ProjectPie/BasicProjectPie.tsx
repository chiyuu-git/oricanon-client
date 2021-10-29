import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { reqRecordWeeklyInfo } from '@src/api';
import React, { useState, useEffect } from 'react';

import NestPie from './NestPie';

const BasicProjectPie = () => {
    const [
        charaIllustWeeklyInfo,
        setCharaIllustWeeklyInfo,
    ] = useState<RecordWeeklyInfo<BasicType.character> | null>(null);

    useEffect(() => {
        async function getWeeklyInfo() {
            const illustWeeklyInfo = await reqRecordWeeklyInfo({
                basicType: BasicType.character,
                infoType: CharacterRecordType.illust,
            });

            setCharaIllustWeeklyInfo(illustWeeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    if (charaIllustWeeklyInfo) {
        const { range, projectInfo, memberInfo } = charaIllustWeeklyInfo;
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
