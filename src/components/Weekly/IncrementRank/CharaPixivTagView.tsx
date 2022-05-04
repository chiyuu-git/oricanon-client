import React, { FC, useContext } from 'react';
import { Category } from '@common/root';
import { CharaRecordType } from '@common/record';

import { WeeklyContext } from '../weekly-context-manager';

import IncrementRank from './IncrementRank';

const CharaPixivTagViewWeekIncrementRank: FC<unknown> = () => {
    const category = Category.chara;
    const recordType = CharaRecordType.tagView;
    const weeklyContext = useContext(WeeklyContext);
    const weeklyInfo = weeklyContext[category][recordType];

    return (
        <IncrementRank
            weeklyInfo = {weeklyInfo}
            category = {category}
            recordType = {recordType}
            rankBarOptions = {{
                title: 'pixiv-标签阅览数-角色周增榜',
                linearGradient: 'rgb(151,255,199)',
                icon: `icon-${recordType.replace(/_/g, '-')}`,
            }}
        />
    );
};

export default CharaPixivTagViewWeekIncrementRank;
