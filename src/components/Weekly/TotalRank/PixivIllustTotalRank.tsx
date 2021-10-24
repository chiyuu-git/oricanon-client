import React, { FC, useState, useEffect, useContext } from 'react';
import { WeeklyContext } from '../weekly-context-manager';
import { TotalRank } from './TotalRank.type';
import RankTable from './RankTable';

const PixivIllustTotalRank = () => {
    const weeklyInfo = useContext(WeeklyContext);
    const [pixivIllustTotalRank, setPixivIllustTotalRank] = useState<TotalRank | null>(null);

    useEffect(() => {
        if (weeklyInfo) {
            const characterMemberInfo = weeklyInfo.characterInfo.memberInfo;

            const totalRank = [...characterMemberInfo]
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

            setPixivIllustTotalRank(totalRank);
        }
    }, [weeklyInfo]);

    if (weeklyInfo && pixivIllustTotalRank) {
        return (
            <RankTable
                title = 'pixiv标签-角色累计榜'
                range = { weeklyInfo.range }
                contentType = 'pixiv-illust-total'
                totalRank = { pixivIllustTotalRank }
            />
        );
    }

    return <div>PixivIllustIncreaseRank</div>;
};

export default PixivIllustTotalRank;
