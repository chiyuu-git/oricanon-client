import React, { FC, useState, useEffect, useContext } from 'react';
import { BasicType, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import { HistoricalIncrementRank } from 'canon/root/weekly';
import { reqIncrementRankOfTypeInRange } from '@src/api';
import { getWeekIncrementRank, IncrementRank } from './common';
import RankBar from './RankBar';
import { WeeklyContext } from '../weekly-context-manager';

const TwitterFollowerWeekIncrementRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRank | null>(null);
    const [historicalIncrementRank, setHistoricalIncrementRank] = useState<HistoricalIncrementRank | null>(null);
    const weeklyInfo = weeklyContext[BasicType.seiyuu][SeiyuuRecordType.twitterFollower];

    useEffect(() => {
        async function getHistoricalIncrementRank() {
            const rank = await reqIncrementRankOfTypeInRange(
                BasicType.seiyuu,
                SeiyuuRecordType.twitterFollower,
            );
            setHistoricalIncrementRank(rank);
        }
        getHistoricalIncrementRank();
    }, []);

    useEffect(() => {
        if (weeklyInfo && historicalIncrementRank) {
            const weekRank = getWeekIncrementRank(weeklyInfo.memberInfoList, historicalIncrementRank);

            setWeekIncrementRank(weekRank);
            setRange(weeklyInfo.range);
        }
    }, [weeklyInfo, historicalIncrementRank]);

    if (weekIncrementRank) {
        return (
            <RankBar
                title = '推特fo数-周增榜'
                range = { range }
                incrementRank = { weekIncrementRank }
            />
        );
    }

    return <div>TwitterFollowerWeekIncrementRank</div>;
};

export default TwitterFollowerWeekIncrementRank;
