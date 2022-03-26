import React, { FC, useState, useEffect, useContext, useMemo } from 'react';
import { Category } from '@common/root';
import { CharaRecordType } from '@common/record';
import { HistoricalIncrementRank } from '@common/summary';
import { reqWeekIncrementRankOfTypeInRange } from '@src/api';

import { MemberInfoContext } from '@components/MemberInfo/member-info-context-manager';
import { WeeklyContext } from '../weekly-context-manager';

import { getWeekIncrementRank, IncrementRank } from './common';
import RankBar from './RankBar';

const CharaPixivIllustWeekIncrementRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const weeklyInfo = weeklyContext[Category.chara][CharaRecordType.illust];
    const charaInfoMap = memberInfoContext.chara;

    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRank | null>(null);
    const [historicalIncrementRank, setHistoricalIncrementRank] = useState<HistoricalIncrementRank | null>(null);

    useEffect(() => {
        async function getHistoricalIncrementRank() {
            const rank = await reqWeekIncrementRankOfTypeInRange(
                Category.chara,
                CharaRecordType.illust,

            );
            console.log('illust historicalIncrementRank:', rank);
            setHistoricalIncrementRank(rank);
        }
        getHistoricalIncrementRank();
    }, []);

    useEffect(() => {
        if (weeklyInfo && historicalIncrementRank && charaInfoMap) {
            const weekRank = getWeekIncrementRank<Category.chara>(
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
                    title = 'pixiv-illust-角色周增榜'
                    range = {range}
                    linearGradient = 'rgb(255,175,175)'
                    icon = 'icon-pixiv-illust'
                    incrementRank = {weekIncrementRank}
                />
            );
        }

        return <div>CharaPixivIllustWeekIncrementRank</div>;
    }, [range, weekIncrementRank]);
};

export default CharaPixivIllustWeekIncrementRank;
