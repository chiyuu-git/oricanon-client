import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Category } from '@common/root';
import { PersonRecordType } from '@common/record';
import { MemberInfoContext } from '@src/components/MemberInfo/member-info-context-manager';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './common';
import RankTable from './RankTable';

const TwitterFollowerTotalRank = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const [range, setRange] = useState('');
    const [totalRank, setTotalRank] = useState<TotalRank | null>(null);
    const weeklyInfo = weeklyContext[Category.person][PersonRecordType.twitterFollower];
    const personInfoMap = memberInfoContext.person;

    useEffect(() => {
        if (weeklyInfo && personInfoMap) {
            const rank = [...weeklyInfo.memberInfoList]
                .sort((a, b) => b.record - a.record)
                .map((memberInfo) => {
                    const { romaName, record, weekIncrement } = memberInfo;
                    const { name, projectName } = personInfoMap[romaName];
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
    }, [weeklyInfo, personInfoMap]);

    return useMemo(() => {
        if (totalRank) {
            return (
                <RankTable
                    title = 'twitter-follower-累计榜'
                    range = {range}
                    totalRank = {totalRank}
                    layoutOption = {{
                        contentType: 'person-total-rank',
                        incrementNodeWidth: '4em',
                    }}
                />
            );
        }

        return <div>TwitterFollowerTotalRank</div>;
    }, [range, totalRank]);
};

export default TwitterFollowerTotalRank;
