import React, { FC, useState, useEffect, useContext, useMemo } from 'react';
import { Category } from '@common/root';
import { RecordType } from '@common/record';
import { reHistoricalWeekIncrementOfPercentile } from '@src/api';

import { MemberInfoContext } from '@components/MemberInfo/member-info-context-manager';
import { RecordTypeWeeklyInfo } from '@common/weekly';

import { getWeekIncrementRank, IncrementRankInfo } from './common';
import RankBar from './RankBar';

interface IncrementRankProps {
    weeklyInfo: RecordTypeWeeklyInfo;
    category: Category;
    recordType: RecordType;
    rankBarOptions: {
        title: string;
        linearGradient: string;
        icon: string;
    };
}

const IncrementRank: FC<IncrementRankProps> = ({ weeklyInfo, category, recordType, rankBarOptions }) => {
    const memberInfoContext = useContext(MemberInfoContext);
    const memberInfoMap = memberInfoContext[category];

    const [range, setRange] = useState('');
    const [weekIncrementRank, setWeekIncrementRank] = useState<IncrementRankInfo | null>(null);
    const [referenceList, setReferenceList] = useState<number[] | null>(null);

    useEffect(() => {
        async function getReferenceList() {
            const reference = await reHistoricalWeekIncrementOfPercentile(
                category,
                recordType,
            );
            setReferenceList([reference]);
        }
        getReferenceList();
    }, [category, recordType]);

    useEffect(() => {
        if (weeklyInfo && referenceList && memberInfoMap) {
            const weekRank = getWeekIncrementRank(
                memberInfoMap,
                weeklyInfo.memberInfoList,
                referenceList,
            );

            setWeekIncrementRank(weekRank);
            setRange(weeklyInfo.range);
        }
    }, [weeklyInfo, referenceList, memberInfoMap]);

    return useMemo(() => {
        if (weekIncrementRank) {
            const { title, linearGradient, icon } = rankBarOptions;
            return (
                <RankBar
                    title = {title}
                    range = {range}
                    linearGradient = {linearGradient}
                    icon = {icon}
                    memberInfoMap = {memberInfoMap}
                    incrementRank = {weekIncrementRank}
                />
            );
        }

        return <div>weekIncrementRank</div>;
    }, [range, weekIncrementRank, memberInfoMap, rankBarOptions]);
};

export default IncrementRank;
