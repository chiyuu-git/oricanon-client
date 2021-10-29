import React, { FC, useState, useEffect, useContext } from 'react';
import { reqRecordWeeklyInfo } from '@src/api';
import { BasicType, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import { getIncreaseRank, IncreaseRank } from './common';
import RankBar from './RankBar';

const TwitterFollowerIncreaseRank: FC<unknown> = () => {
    const [range, setRange] = useState('');
    const [twitterFollowerIncreaseRank, setTwitterFollowerIncreaseRank] = useState<IncreaseRank | null>(null);

    useEffect(() => {
        async function processWeeklyInfo() {
            const twitterFollowerWeeklyInfo = await reqRecordWeeklyInfo({
                basicType: BasicType.seiyuu,
                infoType: SeiyuuRecordType.twitterFollower,
            });

            const increaseRank = getIncreaseRank(twitterFollowerWeeklyInfo);

            setTwitterFollowerIncreaseRank(increaseRank);
            setRange(twitterFollowerWeeklyInfo.range);
        }
        processWeeklyInfo();
    }, []);

    if (twitterFollowerIncreaseRank) {
        return (
            <RankBar
                title = '声优fo数-周增榜'
                range = { range }
                increaseRank = { twitterFollowerIncreaseRank }
            />
        );
    }

    return <div>TwitterFollowerIncreaseRank</div>;
};

export default TwitterFollowerIncreaseRank;
