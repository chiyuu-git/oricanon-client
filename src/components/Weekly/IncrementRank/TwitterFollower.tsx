import React, { FC, useContext } from 'react';
import { Category } from '@common/root';
import { PersonRecordType } from '@common/record';
import { WeeklyContext } from '../weekly-context-manager';
import IncrementRank from './IncrementRank';

const TwitterFollowerWeekIncrementRank: FC<unknown> = () => {
    const category = Category.person;
    const recordType = PersonRecordType.twitterFollower;
    const weeklyContext = useContext(WeeklyContext);
    const weeklyInfo = weeklyContext[category][recordType];

    return (
        <IncrementRank
            weeklyInfo = {weeklyInfo}
            category = {category}
            recordType = {recordType}
            rankBarOptions = {{
                title: 'twitter-follower-周增榜',
                linearGradient: 'rgb(136,141,255)',
                icon: `icon-${recordType.replace(/_/g, '-')}`,
            }}
        />
    );
};

export default TwitterFollowerWeekIncrementRank;
