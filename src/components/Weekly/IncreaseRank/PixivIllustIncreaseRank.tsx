import React, { FC, useState, useEffect } from 'react';
import { BasicType, RecordType } from '@chiyu-bit/canon.root';
import { reqWeeklyInfoOfRecordType } from '@src/api';
import { IncreaseRank } from './IncreaseRank.type';
import RankBar from './RankBar';

const PixivIllustIncreaseRank: FC<unknown> = () => {
    const [range, setRange] = useState('');
    const [pixivIllustIncreaseRank, setPixivIllustIncreaseRank] = useState<IncreaseRank | null>(null);

    useEffect(() => {
        async function processWeeklyInfo() {
            // TODO: 请求的类型有重复的，有交集，缓存？ 提升请求的位置然后 context 共享？直接使用 GET 的缓存就好了
            const illustWeeklyInfo = await reqWeeklyInfoOfRecordType({
                basicType: BasicType.character,
                recordType: RecordType.illust,
            });

            const characterMemberInfo = illustWeeklyInfo.recordWeekInfo.memberInfo;

            const increaseRank = [...characterMemberInfo]
                .sort((a, b) => a.weekIncrease - b.weekIncrease)
                .map((memberInfo) => {
                    const { name, romaName, weekIncrease, projectName, weekIncreaseRate, supportColor } = memberInfo;
                    return {
                        name,
                        romaName,
                        increase: weekIncrease < 0 ? 0 : weekIncrease,
                        projectName,
                        increaseRate: weekIncreaseRate || '-',
                    };
                });

            setPixivIllustIncreaseRank(increaseRank);
            setRange(illustWeeklyInfo.range);
        }
        processWeeklyInfo();
    }, []);

    if (pixivIllustIncreaseRank) {
        return (
            <RankBar
                title = 'pixiv标签-角色周增榜'
                range = { range }
                increaseRank = { pixivIllustIncreaseRank }
            />
        );
    }

    return <div>PixivIllustIncreaseRank</div>;
};

export default PixivIllustIncreaseRank;
