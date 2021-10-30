import React, { FC, useState, useEffect, useContext } from 'react';
import { BasicType, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import { getIncreaseRank, IncreaseRank } from './common';
import RankBar from './RankBar';
import { WeeklyContext } from '../weekly-context-manager';

const TwitterFollowerIncreaseRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [twitterFollowerIncreaseRank, setTwitterFollowerIncreaseRank] = useState<IncreaseRank | null>(null);
    const twitterFollowerWeeklyInfo = weeklyContext[BasicType.seiyuu][SeiyuuRecordType.twitterFollower];

    useEffect(() => {
        if (twitterFollowerWeeklyInfo) {
            const increaseRank = getIncreaseRank(twitterFollowerWeeklyInfo);

            setTwitterFollowerIncreaseRank(increaseRank);
            setRange(twitterFollowerWeeklyInfo.range);
        }
    }, [twitterFollowerWeeklyInfo]);

    if (twitterFollowerIncreaseRank) {
        return (
            <RankBar
                title = '推特fo数-周增榜'
                range = { range }
                increaseRank = { twitterFollowerIncreaseRank }
            />
        );
    }

    return <div>TwitterFollowerIncreaseRank</div>;
};

export default TwitterFollowerIncreaseRank;
