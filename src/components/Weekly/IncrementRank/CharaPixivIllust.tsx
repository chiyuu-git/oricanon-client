import React, { FC, useState, useEffect, useContext } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { HistoricalIncrementRank } from '@chiyu-bit/canon.root/weekly';
import { reqIncrementRankOfTypeInRange } from '@src/api';

import { MemberInfoContext } from '@components/MemberInfo/member-info-context-manager';
import { WeeklyContext } from '../weekly-context-manager';

import {
    getWeekIncrementRank,
    IncrementRank,
} from './common';
import RankBar from './RankBar';

const CharaPixivIllustWeekIncrementRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRank | null>(null);
    const [historicalIncrementRank, setHistoricalIncrementRank] = useState<HistoricalIncrementRank | null>(null);
    const weeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.illust];
    const charaInfoMap = memberInfoContext.character;

    useEffect(() => {
        async function getHistoricalIncrementRank() {
            const rank = await reqIncrementRankOfTypeInRange(
                BasicType.character,
                CharacterRecordType.illust,
            );
            console.log('historicalIncrementRank:', rank);
            setHistoricalIncrementRank(rank);
        }
        getHistoricalIncrementRank();
    }, []);

    useEffect(() => {
        if (weeklyInfo && historicalIncrementRank && charaInfoMap) {
            const weekRank = getWeekIncrementRank<BasicType.character>(
                charaInfoMap,
                weeklyInfo.memberInfoList,
                historicalIncrementRank,
            );

            setWeekIncrementRank(weekRank);
            setRange(weeklyInfo.range);
        }
    }, [weeklyInfo, historicalIncrementRank, charaInfoMap]);

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
