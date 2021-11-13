import React, { useState, useEffect, useContext } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './TotalRank.type';
import RankTable from './RankTable';

const PixivTagViewTotalRank = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [pixivTagViewTotalRank, setPixivIllustTotalRank] = useState<TotalRank | null>(null);
    const weeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.tagView];

    useEffect(() => {
        if (weeklyInfo) {
            const totalRank = [...weeklyInfo.memberInfo]
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

            setRange(weeklyInfo.range);
            setPixivIllustTotalRank(totalRank);
        }
    }, [weeklyInfo]);

    if (pixivTagViewTotalRank) {
        return (
            <RankTable
                title = 'pixiv标签阅览数-角色累计榜'
                range = { range }
                totalRank = { pixivTagViewTotalRank }
                layoutOption = { {
                    contentType: 'chara-total-rank',
                    increaseNodeWidth: '5.5em',
                } }
            />
        );
    }

    return <div>PixivTagViewTotalRank</div>;
};

export default PixivTagViewTotalRank;
