import React, { FC, useState, useEffect, useContext } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { HistoricalIncrementRank } from '@chiyu-bit/canon.root/weekly';
import { reqIncrementRankOfTypeInRange } from '@src/api';

import {
    getWeekIncrementRank,
    IncrementRank,
} from './common';
import RankBar from './RankBar';

import { WeeklyContext } from '../weekly-context-manager';

const CharaPixivIllustWeekIncrementRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRank | null>(null);
    const [historicalIncrementRank, setHistoricalIncrementRank] = useState<HistoricalIncrementRank | null>(null);
    const weeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.illust];

    useEffect(() => {
        async function getHistoricalIncrementRank() {
            const rank = await reqIncrementRankOfTypeInRange(
                BasicType.character,
                CharacterRecordType.illust,
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
                title = 'pixiv-illust-角色周增榜'
                range = { range }
                incrementRank = { weekIncrementRank }
            />
        );
    }

    return <div>CharaPixivIllustWeekIncrementRank</div>;
};

export default CharaPixivIllustWeekIncrementRank;
