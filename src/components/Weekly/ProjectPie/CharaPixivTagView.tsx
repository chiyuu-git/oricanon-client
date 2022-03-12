import { BasicType } from '@common/root';
import { CharaRecordType } from '@common/record';
import { MemberInfoContext } from '@src/components/MemberInfo/member-info-context-manager';
import React, { useContext, useMemo } from 'react';
import { WeeklyContext } from '../weekly-context-manager';

import NestPie from './NestPie';

const CharaPixivTagViewProjectPie = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const weeklyInfo = weeklyContext[BasicType.chara][CharaRecordType.tagView];
    const charaInfoMap = memberInfoContext.chara;

    return useMemo(() => {
        if (weeklyInfo && charaInfoMap) {
            const { range, projectInfoList, memberInfoList } = weeklyInfo;
            return (
                <NestPie
                    title = 'pixiv-标签阅览数-企划周增榜'
                    range = {range}
                    memberInfoMap = {charaInfoMap}
                    projectInfoList = {projectInfoList}
                    memberInfoList = {memberInfoList}
                    showWidget
                    size = {{
                        width: '800px',
                        height: '800px',
                    }}
                />
            );
        }

        return <div>CharaPixivTagViewProjectPie</div>;
    }, [weeklyInfo, charaInfoMap]);
};

export default CharaPixivTagViewProjectPie;
