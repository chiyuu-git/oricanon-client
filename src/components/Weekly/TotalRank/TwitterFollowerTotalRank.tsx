import React, { FC, useState, useEffect, useContext } from 'react';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './TotalRank.type';
import RankTable from './RankTable';

const TwitterFollowerTotalRank = () => {
    const weeklyInfo = useContext(WeeklyContext);
    const [twitterFollowerTotalRank, setTwitterFollowerTotalRank] = useState<TotalRank | null>(null);

    useEffect(() => {
        if (weeklyInfo) {
            const seiyuuMemberInfo = weeklyInfo.seiyuuInfo.memberInfo;

            console.log('seiyuuMemberInfo:', seiyuuMemberInfo);
            const totalRank = [...seiyuuMemberInfo]
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

            setTwitterFollowerTotalRank(totalRank);
        }
    }, [weeklyInfo]);

    if (weeklyInfo && twitterFollowerTotalRank) {
        return (
            <RankTable
                title = '推特fo数-累计榜'
                range = { weeklyInfo.range }
                contentType = 'twitter-follower-total'
                totalRank = { twitterFollowerTotalRank }
            />
        );
    }

    return <div>TwitterFollowerTotalRank</div>;
};

export default TwitterFollowerTotalRank;
