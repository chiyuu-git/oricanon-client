import React, { FC, useState, useEffect, useContext } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { getIncreaseRank, IncreaseRank } from './common';
import RankBar from './RankBar';
import { WeeklyContext } from '../weekly-context-manager';

const PixivTagViewIncreaseRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [charaTagViewIncreaseRank, setCharaIllustIncreaseRank] = useState<IncreaseRank | null>(null);
    const weeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.tagView];

    useEffect(() => {
        if (weeklyInfo) {
            const increaseRank = getIncreaseRank(weeklyInfo);

            setCharaIllustIncreaseRank(increaseRank);
            setRange(weeklyInfo.range);
        }
    }, [weeklyInfo]);

    if (charaTagViewIncreaseRank) {
        return (
            <RankBar
                title = 'pixiv标签阅览数-角色周增榜'
                range = { range }
                increaseRank = { charaTagViewIncreaseRank }
            />
        );
    }

    return <div>PixivTagViewIncreaseRank</div>;
};

export default PixivTagViewIncreaseRank;
