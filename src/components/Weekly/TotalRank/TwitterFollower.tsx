import React, { useState, useEffect, useContext } from 'react';
import { BasicType, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './common';
import RankTable from './RankTable';

const TwitterFollowerTotalRank = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [totalRank, setTotalRank] = useState<TotalRank | null>(null);
    const weeklyInfo = weeklyContext[BasicType.seiyuu][SeiyuuRecordType.twitterFollower];

    useEffect(() => {
        if (weeklyInfo) {
            const rank = [...weeklyInfo.memberInfoList]
                .sort((a, b) => b.record - a.record)
                .map((memberInfo) => {
                    const { name, record, weekIncrement, projectName } = memberInfo;
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
    }, [weeklyInfo]);

    if (totalRank) {
        return (
            <RankTable
                title = '推特fo数-累计榜'
                range = { range }
                totalRank = { totalRank }
                layoutOption = { {
                    contentType: 'seiyuu-total-rank',
                    incrementNodeWidth: '4em',
                } }
            />
        );
    }

    return <div>TwitterFollowerTotalRank</div>;
};

export default TwitterFollowerTotalRank;
