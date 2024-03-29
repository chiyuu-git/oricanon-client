import React, { useState, useEffect, useContext } from 'react';
import { Category } from '@common/root';
import { CharaRecordType } from '@common/record';
import { RecordTypeWeeklyInfo } from '@common/weekly';
import { reqRecordTypeWeekly } from '@src/api';

import { MemberInfoContext } from '@src/components/MemberInfo/member-info-context-manager';
import NestPie from './NestPie';

function CompareProjectPie() {
    const [
        weeklyInfo,
        setWeeklyInfo,
    ] = useState<RecordTypeWeeklyInfo | null>(null);
    const memberInfoContext = useContext(MemberInfoContext);
    const memberCharaInfoMap = memberInfoContext.chara;

    useEffect(() => {
        async function getWeeklyInfo() {
            const charaPixivIllustWeeklyInfo = await reqRecordTypeWeekly(
                Category.chara,
                CharaRecordType.illust,
                '2021-01-08',
            );

            setWeeklyInfo(charaPixivIllustWeeklyInfo);
        }
        getWeeklyInfo();
    }, []);

    if (weeklyInfo && memberCharaInfoMap) {
        const { range, projectInfoList, memberInfoList } = weeklyInfo;

        return (
            <NestPie
                title = '创作数对比-企划周增榜'
                range = {range}
                memberInfoMap = {memberCharaInfoMap}
                projectInfoList = {projectInfoList}
                memberInfoList = {memberInfoList}
                showWidget = {false}
                size = {{
                    width: '640px',
                    height: '640px',
                }}
            />
        );
    }

    return <div>CompareProjectPie</div>;
}

export default CompareProjectPie;
