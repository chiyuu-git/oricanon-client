import React, { FC, useState, useEffect, useContext } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { getIncreaseRank, IncreaseRank } from './common';
import RankBar from './RankBar';
import { WeeklyContext } from '../weekly-context-manager';

const CharaIllustIncreaseRank: FC<unknown> = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [range, setRange] = useState('');
    const [charaIllustIncreaseRank, setCharaIllustIncreaseRank] = useState<IncreaseRank | null>(null);
    const PixivIllustWeeklyInfo = weeklyContext[BasicType.character][CharacterRecordType.illust];

    useEffect(() => {
        if (PixivIllustWeeklyInfo) {
            const increaseRank = getIncreaseRank(PixivIllustWeeklyInfo);

            setCharaIllustIncreaseRank(increaseRank);
            setRange(PixivIllustWeeklyInfo.range);
        }
    }, [PixivIllustWeeklyInfo]);

    if (charaIllustIncreaseRank) {
        return (
            <RankBar
                title = 'pixiv标签创作数-角色周增榜'
                range = { range }
                increaseRank = { charaIllustIncreaseRank }
            />
        );
    }

    return <div>CharaIllustIncreaseRank</div>;
};

export default CharaIllustIncreaseRank;
