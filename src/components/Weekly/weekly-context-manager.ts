import React, { createContext } from 'react';
import { BasicType, CharacterRecordType, SeiyuuRecordType, AggregationType } from '@chiyu-bit/canon.root';

import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';

type CharaRecordWeeklyInfo = Record<CharacterRecordType, RecordWeeklyInfo<BasicType.character>>
& Record<AggregationType, RecordWeeklyInfo<BasicType.character>>

type CoupleRecordWeeklyInfo = Record<CharacterRecordType, RecordWeeklyInfo<BasicType.couple>>
& Record<AggregationType, RecordWeeklyInfo<BasicType.couple>>

type SeiyuuRecordWeeklyInfo = Record<SeiyuuRecordType, RecordWeeklyInfo<BasicType.seiyuu>>;

export type WeeklyInfo = {
    [BasicType.character]: CharaRecordWeeklyInfo;
    [BasicType.couple]: CoupleRecordWeeklyInfo;
    [BasicType.seiyuu]: SeiyuuRecordWeeklyInfo;
};

export const initWeeklyContext: WeeklyInfo = {
    [BasicType.character]: {} as CharaRecordWeeklyInfo,
    [BasicType.couple]: {} as CoupleRecordWeeklyInfo,
    [BasicType.seiyuu]: {} as SeiyuuRecordWeeklyInfo,
};
// createContext 参考
// https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const WeeklyContext = createContext<WeeklyInfo>(initWeeklyContext);

