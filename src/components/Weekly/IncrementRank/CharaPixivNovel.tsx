import React, { FC, useContext } from 'react';
import { Category } from '@common/root';
import { CharaRecordType } from '@common/record';

import { WeeklyContext } from '../weekly-context-manager';

import IncrementRank from './IncrementRank';

const CharaPixivNovelWeekIncrementRank: FC<unknown> = () => {
    const category = Category.chara;
    const recordType = CharaRecordType.novel;
    const weeklyContext = useContext(WeeklyContext);
    const weeklyInfo = weeklyContext[category][recordType];

    return (
        <IncrementRank
            weeklyInfo = {weeklyInfo}
            category = {category}
            recordType = {recordType}
            rankBarOptions = {{
                title: 'pixiv-novel-角色周增榜',
                linearGradient: 'rgb(255,213,133)',
                icon: `icon-${recordType.replace(/_/g, '-')}`,
            }}
        />
    );
};

export default CharaPixivNovelWeekIncrementRank;
