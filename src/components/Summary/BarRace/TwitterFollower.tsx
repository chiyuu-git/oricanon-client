import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BasicType, ProjectName, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import { reqMemberList, reqRelativeIncrementOfTypeInRange } from '@src/api';

import BarRace from './BarRace';
import { BarRaceDataSource, RawData } from './common';

const TwitterFollowerBarRace = () => {
    const lineRace = useRef(null);
    const [dataSet, setDataSet] = useState<BarRaceDataSource | null>(null);
    useEffect(() => {
        async function getRecordOfTypeInRange() {
            const seiyuuRecord = await reqRelativeIncrementOfTypeInRange(
                BasicType.seiyuu,
                SeiyuuRecordType.twitterFollower,
                ProjectName.llss,
                '2020-12-18',
                '2021-12-14',
            );

            const liellaMemberList = await reqMemberList({
                projectName: ProjectName.llss,
                type: BasicType.seiyuu,
            });

            const seiyuuRecordData: RawData = seiyuuRecord.map((record) => {
                const { date, records } = record;
                return [date, ...records] as const;
            });

            const seiyuuList = liellaMemberList.list.map(({ name }) => name);
            const list = [
                '伊達さゆり-sayurin',
                'Liyuu-liyuu',
                '岬なこ-nako',
                'ペイトン尚未-payton',
                '青山なぎさ-nagisa',
            ];

            const source: BarRaceDataSource = [
                [
                    'date',
                    ...list,
                ],
                ...seiyuuRecordData,
            ];

            setDataSet(source);
        }
        getRecordOfTypeInRange();
    }, []);

    return useMemo(() => {
        if (dataSet) {
            return (
                <div>
                    <BarRace barRaceDataSet = { dataSet } />
                </div>
            );
        }

        return (
            <div>
                TwitterFollowerBarRace
            </div>
        );
    }, [dataSet]);
};

export default TwitterFollowerBarRace;
