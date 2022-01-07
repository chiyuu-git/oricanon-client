import React, { FC, useState, useEffect, useContext, useMemo } from 'react';
import { BasicType } from '@common/root';
import { CharaRecordType } from '@common/record';
import { HistoricalIncrementRank } from '@common/summary';
import { reqWeekIncrementRankOfTypeInRange } from '@src/api';

import { MemberInfoContext } from '@components/MemberInfo/member-info-context-manager';
import { WeeklyContext } from '../weekly-context-manager';

import { getWeekIncrementRank, IncrementRank } from './common';
import RankBar from './RankBar';

const CharaPixivNovelWeekIncrementRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const weeklyInfo = weeklyContext[BasicType.chara][CharaRecordType.novel];
    const charaInfoMap = memberInfoContext.chara;

    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRank | null>(null);
    const [historicalIncrementRank, setHistoricalIncrementRank] = useState<HistoricalIncrementRank | null>(null);

    useEffect(() => {
        async function getHistoricalIncrementRank() {
            const rank = await reqWeekIncrementRankOfTypeInRange(
                BasicType.chara,
                CharaRecordType.novel,
            );
            console.log('novel historicalIncrementRank:', rank);
            setHistoricalIncrementRank(rank);
        }
        getHistoricalIncrementRank();
    }, []);

    useEffect(() => {
        if (weeklyInfo && historicalIncrementRank && charaInfoMap) {
            const weekRank = getWeekIncrementRank<BasicType.chara>(
                charaInfoMap,
                weeklyInfo.memberInfoList,
                historicalIncrementRank,
            );

            setWeekIncrementRank(weekRank);
            setRange(weeklyInfo.range);
        }
    }, [weeklyInfo, historicalIncrementRank, charaInfoMap]);

    return useMemo(() => {
        if (weekIncrementRank) {
            return (
                <RankBar
                    title = 'pixiv-novel-角色周增榜'
                    range = { range }
                    linearGradient = 'rgb(255,213,133)'
                    icon = 'icon-pixiv-novel'
                    incrementRank = { weekIncrementRank }
                />
            );
        }

        return <div>CharaPixivNovelWeekIncrementRank</div>;
    }, [range, weekIncrementRank]);
};

export default CharaPixivNovelWeekIncrementRank;
