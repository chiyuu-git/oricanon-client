import React, { FC, useState, useEffect } from 'react';
import { BasicType, CharacterRecordType } from '@chiyu-bit/canon.root';
import { reqRecordWeeklyInfo } from '@src/api';
import { getIncreaseRank, IncreaseRank } from './common';
import RankBar from './RankBar';

const CharaIllustIncreaseRank: FC<unknown> = () => {
    const [range, setRange] = useState('');
    const [charaIllustIncreaseRank, setCharaIllustIncreaseRank] = useState<IncreaseRank | null>(null);

    useEffect(() => {
        async function processWeeklyInfo() {
            // TODO: 请求的类型有重复的，有交集，缓存？ 提升请求的位置然后 context 共享？直接使用 GET 的缓存就好了
            const illustWeeklyInfo = await reqRecordWeeklyInfo({
                basicType: BasicType.character,
                infoType: CharacterRecordType.illust,
            });

            const increaseRank = getIncreaseRank(illustWeeklyInfo);

            setCharaIllustIncreaseRank(increaseRank);
            setRange(illustWeeklyInfo.range);
        }
        processWeeklyInfo();
    }, []);

    if (charaIllustIncreaseRank) {
        return (
            <RankBar
                title = 'pixiv标签-角色周增榜'
                range = { range }
                increaseRank = { charaIllustIncreaseRank }
            />
        );
    }

    return <div>CharaIllustIncreaseRank</div>;
};

export default CharaIllustIncreaseRank;
