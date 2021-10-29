import React, { useState, useEffect, useContext } from 'react';
import { BasicType, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './TotalRank.type';
import RankTable from './RankTable';

const TwitterFollowerTotalRank = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [twitterFollowerTotalRank, setTwitterFollowerTotalRank] = useState<TotalRank | null>(null);
    const twitterFollowerWeeklyInfo = weeklyContext[BasicType.seiyuu][SeiyuuRecordType.twitterFollower];

    useEffect(() => {
        if (twitterFollowerWeeklyInfo) {
            const totalRank = [...twitterFollowerWeeklyInfo.memberInfo]
                .sort((a, b) => b.record - a.record)
                .map((memberInfo) => {
                    const { name, record, weekIncrease, projectName } = memberInfo;
                    return {
                        name,
                        projectName,
                        record,
                        increase: weekIncrease,
                    };
                });
            setRange(twitterFollowerWeeklyInfo.range);
            setTwitterFollowerTotalRank(totalRank);
        }
    }, [twitterFollowerWeeklyInfo]);

    if (twitterFollowerTotalRank) {
        return (
            <RankTable
                title = '推特fo数-累计榜'
                range = { range }
                contentType = 'twitter-follower-total'
                totalRank = { twitterFollowerTotalRank }
            />
        );
    }

    return <div>TwitterFollowerTotalRank</div>;
};

export default TwitterFollowerTotalRank;
