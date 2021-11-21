import React, { useState, useEffect, useContext } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './common';
import RankTable from './RankTable';

const CharaPixivIllustTotalRank = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [totalRank, setTotalRank] = useState<TotalRank | null>(null);
    const weeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.illust];

    useEffect(() => {
        if (weeklyInfo) {
            const rank = [...weeklyInfo.memberInfoList]
                .sort((a, b) => b.record - a.record)
                .map((memberInfo) => {
                    const { name, record, weekIncrement, projectName } = memberInfo;
                    return {
                        name,
                        projectName,
                        record,
                        increment: weekIncrement,
                    };
                });

            setRange(weeklyInfo.range);
            setTotalRank(rank);
        }
    }, [weeklyInfo]);

    if (totalRank) {
        return (
            <RankTable
                title = 'pixiv-illust-角色累计榜'
                range = { range }
                totalRank = { totalRank }
                layoutOption = { {
                    contentType: 'chara-total-rank',
                    incrementNodeWidth: '3em',
                } }
            />
        );
    }

    return <div>CharaPixivIllustTotalRank</div>;
};

export default CharaPixivIllustTotalRank;
