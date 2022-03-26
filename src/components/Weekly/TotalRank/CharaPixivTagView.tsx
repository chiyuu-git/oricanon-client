import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Category } from '@common/root';
import { CharaRecordType } from '@common/record';
import { MemberInfoContext } from '@src/components/MemberInfo/member-info-context-manager';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './common';
import RankTable from './RankTable';

const CharaPixivTagViewTotalRank = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const [range, setRange] = useState('');
    const [totalRank, setTotalRank] = useState<TotalRank | null>(null);
    const weeklyInfo = weeklyContext[Category.chara][CharaRecordType.tagView];
    const charaInfoMap = memberInfoContext.chara;

    useEffect(() => {
        if (weeklyInfo && charaInfoMap) {
            const rank = [...weeklyInfo.memberInfoList]
                .sort((a, b) => b.record - a.record)
                .map((memberInfo) => {
                    const { romaName, record, weekIncrement } = memberInfo;
                    const { name, projectName } = charaInfoMap[romaName];
                    return {
                        name,
                        projectName,
                        record,
                        increment: weekIncrement,
                    };
                });

            setRange(weeklyInfo.range);
            setTotalRank(rank);
        }
    }, [weeklyInfo, charaInfoMap]);

    return useMemo(() => {
        if (totalRank) {
            return (
                <RankTable
                    title = 'pixiv-标签阅览数-角色累计榜'
                    range = {range}
                    totalRank = {totalRank}
                    layoutOption = {{
                        contentType: 'chara-total-rank',
                        incrementNodeWidth: '5.5em',
                    }}
                />
            );
        }

        return <div>CharaPixivTagViewTotalRank</div>;
    }, [range, totalRank]);
};

export default CharaPixivTagViewTotalRank;
