import React, { FC, useState, useEffect, useContext, useMemo } from 'react';
import { BasicType } from '@common/root';
import { SeiyuuRecordType } from '@common/record';
import { HistoricalIncrementRank } from '@common/summary';
import { reqWeekIncrementRankOfTypeInRange } from '@src/api';
import { MemberInfoContext } from '@components/MemberInfo/member-info-context-manager';
import { WeeklyContext } from '../weekly-context-manager';
import { getWeekIncrementRank, IncrementRank } from './common';
import RankBar from './RankBar';

const TwitterFollowerWeekIncrementRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const weeklyInfo = weeklyContext[BasicType.seiyuu][SeiyuuRecordType.twitterFollower];
    const seiyuuInfoMap = memberInfoContext.seiyuu;

    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRank | null>(null);
    const [historicalIncrementRank, setHistoricalIncrementRank] = useState<HistoricalIncrementRank | null>(null);

    useEffect(() => {
        async function getHistoricalIncrementRank() {
            const rank = await reqWeekIncrementRankOfTypeInRange(
                BasicType.seiyuu,
                SeiyuuRecordType.twitterFollower,
            );
            console.log('follower historicalIncrementRank:', rank);
            setHistoricalIncrementRank(rank);
        }
        getHistoricalIncrementRank();
    }, []);

    useEffect(() => {
        if (weeklyInfo && historicalIncrementRank && seiyuuInfoMap) {
            const weekRank = getWeekIncrementRank<BasicType.seiyuu>(
                seiyuuInfoMap,
                weeklyInfo.memberInfoList,
                historicalIncrementRank,
            );

            setWeekIncrementRank(weekRank);
            setRange(weeklyInfo.range);
        }
    }, [weeklyInfo, historicalIncrementRank, seiyuuInfoMap]);

    return useMemo(() => {
        if (weekIncrementRank) {
            return (
                <RankBar
                    title = 'twitter-follower-周增榜'
                    range = {range}
                    linearGradient = 'rgb(136,141,255)'
                    icon = 'icon-twitter-follower'
                    incrementRank = {weekIncrementRank}
                />
            );
        }

        return <div>TwitterFollowerWeekIncrementRank</div>;
    }, [range, weekIncrementRank]);
};

export default TwitterFollowerWeekIncrementRank;
