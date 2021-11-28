import React, { FC, useState, useEffect, useContext } from 'react';
import { BasicType, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import { HistoricalIncrementRank } from 'canon/root/weekly';
import { reqIncrementRankOfTypeInRange } from '@src/api';
import { MemberInfoContext } from '@components/MemberInfo/member-info-context-manager';
import { WeeklyContext } from '../weekly-context-manager';
import { getWeekIncrementRank, IncrementRank } from './common';
import RankBar from './RankBar';

const TwitterFollowerWeekIncrementRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRank | null>(null);
    const [historicalIncrementRank, setHistoricalIncrementRank] = useState<HistoricalIncrementRank | null>(null);
    const weeklyInfo = weeklyContext[BasicType.seiyuu][SeiyuuRecordType.twitterFollower];
    const seiyuuInfoMap = memberInfoContext.seiyuu;

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
