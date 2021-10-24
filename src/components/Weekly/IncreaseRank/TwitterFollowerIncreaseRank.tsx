import React, { FC, useState, useEffect, useContext } from 'react';
import { WeeklyContext } from '../weekly-context-manager';
import { IncreaseRank } from './IncreaseRank.type';
import RankBar from './RankBar';

const TwitterFollowerIncreaseRank: FC<unknown> = () => {
    const weeklyInfo = useContext(WeeklyContext);
    const [twitterFollowerIncreaseRank, setTwitterFollowerIncreaseRank] = useState<IncreaseRank | null>(null);

    useEffect(() => {
        if (weeklyInfo) {
            const seiyuuMemberInfo = weeklyInfo.seiyuuInfo.memberInfo;

            const increaseRank = [...seiyuuMemberInfo]
                .sort((a, b) => a.weekIncrease - b.weekIncrease)
                .map((memberInfo) => {
                    const { name, romaName, weekIncrease, projectName, weekIncreaseRate } = memberInfo;
                    return {
                        name,
                        romaName,
                        increase: weekIncrease < 0 ? 0 : weekIncrease,
                        projectName,
                        increaseRate: weekIncreaseRate || '-',
                    };
                });

            setTwitterFollowerIncreaseRank(increaseRank);
        }
    }, [weeklyInfo]);

    if (weeklyInfo && twitterFollowerIncreaseRank) {
        return (
            <RankBar
                title = '声优fo数-周增榜'
                range = { weeklyInfo.range }
                increaseRank = { twitterFollowerIncreaseRank }
            />
        );
    }

    return <div>TwitterFollowerIncreaseRank</div>;
};

export default TwitterFollowerIncreaseRank;
