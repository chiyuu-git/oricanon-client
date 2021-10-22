import React, { FC, useState, useEffect, useContext } from 'react';
import { WeeklyContext } from '../weekly-context-manager';
import { IncreaseRank } from './IncreaseRank.type';
import RankBar from './RankBar';

const PixivIllustIncreaseRank: FC<unknown> = () => {
    const weeklyInfo = useContext(WeeklyContext);
    const [pixivIllustIncreaseRank, setPixivIllustIncreaseRank] = useState<IncreaseRank | null>(null);

    useEffect(() => {
        if (weeklyInfo) {
            const characterMemberInfo = weeklyInfo.characterInfo.memberInfo;

            const increaseRank = characterMemberInfo
                .sort((a, b) => a.weekIncrease - b.weekIncrease)
                .map((memberInfo) => {
                    const { name, romaName, weekIncrease, projectName, weekIncreaseRate, supportColor } = memberInfo;
                    return {
                        name,
                        romaName,
                        supportColor,
                        increase: weekIncrease < 0 ? 0 : weekIncrease,
                        projectName,
                        increaseRate: weekIncreaseRate || '-',
                    };
                });

            setPixivIllustIncreaseRank(increaseRank);
        }
    }, [weeklyInfo]);

    if (weeklyInfo && pixivIllustIncreaseRank) {
        return (
            <RankBar
                title = 'pixiv标签-角色周增榜'
                range = { weeklyInfo.range }
                increaseRank = { pixivIllustIncreaseRank }
            />
        );
    }

    return <div>PixivIllustIncreaseRank</div>;
};

export default PixivIllustIncreaseRank;
