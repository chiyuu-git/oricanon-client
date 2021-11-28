import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { MemberInfoContext } from '@src/components/MemberInfo/member-info-context-manager';
import React, { useState, useEffect, useContext } from 'react';
import { WeeklyContext } from '../weekly-context-manager';

import NestPie from './NestPie';

const BasicProjectPie = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const charaPixivIllustWeeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.illust];
    const memberCharaInfoMap = memberInfoContext.character;

    if (charaPixivIllustWeeklyInfo && memberCharaInfoMap) {
        const { range, projectInfoList, memberInfoList } = charaPixivIllustWeeklyInfo;
        return (
            <NestPie
                title = 'pixiv-illust-企划周增榜'
                range = { range }
                memberInfoMap = { memberCharaInfoMap }
                projectInfoList = { projectInfoList }
                memberInfoList = { memberInfoList }
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
