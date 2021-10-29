import React, { useState, useEffect, useContext } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './TotalRank.type';
import RankTable from './RankTable';

const PixivIllustTotalRank = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [pixivIllustTotalRank, setPixivIllustTotalRank] = useState<TotalRank | null>(null);
    const pixivIllustWeeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.illust];

    useEffect(() => {
        if (pixivIllustWeeklyInfo) {
            const totalRank = [...pixivIllustWeeklyInfo.memberInfo]
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

            setRange(pixivIllustWeeklyInfo.range);
            setPixivIllustTotalRank(totalRank);
        }
    }, [pixivIllustWeeklyInfo]);

    if (pixivIllustTotalRank) {
        return (
            <RankTable
                title = 'pixiv标签-角色累计榜'
                range = { range }
                contentType = 'pixiv-illust-total'
                totalRank = { pixivIllustTotalRank }
            />
        );
    }

    return <div>PixivIllustIncreaseRank</div>;
};

export default PixivIllustTotalRank;
