import React, { FC, useContext } from 'react';
import { Category } from '@common/root';
import { CharaRecordType } from '@common/record';

import { WeeklyContext } from '../weekly-context-manager';

import IncrementRank from './IncrementRank';

const CharaPixivIllustWeekIncrementRank: FC<unknown> = () => {
    const category = Category.chara;
    const recordType = CharaRecordType.illust;
    const weeklyContext = useContext(WeeklyContext);
    const weeklyInfo = weeklyContext[category][recordType];

    return (
        <IncrementRank
            weeklyInfo = {weeklyInfo}
            category = {category}
            recordType = {CharaRecordType.illust}
            rankBarOptions = {{
                title: 'pixiv-illust-角色周增榜',
                linearGradient: 'rgb(255,175,175)',
                icon: `icon-${recordType.replace(/_/g, '-')}`,
            }}
        />
    );
};

export default CharaPixivIllustWeekIncrementRank;
