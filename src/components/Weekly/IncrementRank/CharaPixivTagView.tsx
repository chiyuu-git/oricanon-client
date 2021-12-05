import React, { FC, useState, useEffect, useContext, useMemo } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { HistoricalIncrementRank } from '@chiyu-bit/canon.root/weekly';
import { reqIncrementRankOfTypeInRange } from '@src/api';

import { MemberInfoContext } from '@components/MemberInfo/member-info-context-manager';
import { WeeklyContext } from '../weekly-context-manager';

import { getWeekIncrementRank, IncrementRank } from './common';
import RankBar from './RankBar';

const CharaPixivTagViewWeekIncrementRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const memberInfoContext = useContext(MemberInfoContext);
    const weeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.tagView];
    const charaInfoMap = memberInfoContext.character;

    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRank | null>(null);
    const [historicalIncrementRank, setHistoricalIncrementRank] = useState<HistoricalIncrementRank | null>(null);

    useEffect(() => {
        async function getHistoricalIncrementRank() {
            const rank = await reqIncrementRankOfTypeInRange(
                BasicType.character,
                CharacterRecordType.tagView,
            );
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

    return useMemo(() => {
        if (weekIncrementRank) {
            return (
                <RankBar
                    title = 'pixiv-标签阅览数-角色周增榜'
                    range = { range }
                    linearGradient = 'rgb(151,255,199)'
                    icon = 'icon-pixiv-tag-view'
                    incrementRank = { weekIncrementRank }
                />
            );
        }

        return <div>CharaPixivTagViewWeekIncrementRank</div>;
    }, [range, weekIncrementRank]);
};

export default CharaPixivTagViewWeekIncrementRank;
