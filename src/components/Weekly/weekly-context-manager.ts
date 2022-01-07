import React, { createContext } from 'react';
import { BasicType } from '@common/root';
import { CharaRecordType, CoupleRecordType, SeiyuuRecordType } from '@common/record';
import { RecordWeeklyInfo } from '@common/weekly';

type CharaRecordWeeklyInfo = Record<CharaRecordType, RecordWeeklyInfo>

type CoupleRecordWeeklyInfo = Record<CoupleRecordType, RecordWeeklyInfo>

type SeiyuuRecordWeeklyInfo = Record<SeiyuuRecordType, RecordWeeklyInfo>;

export type WeeklyInfo = {
    [BasicType.chara]: CharaRecordWeeklyInfo;
    [BasicType.couple]: CoupleRecordWeeklyInfo;
    [BasicType.seiyuu]: SeiyuuRecordWeeklyInfo;
};

export const initWeeklyContext: WeeklyInfo = {
    [BasicType.chara]: {} as CharaRecordWeeklyInfo,
    [BasicType.couple]: {} as CoupleRecordWeeklyInfo,
    [BasicType.seiyuu]: {} as SeiyuuRecordWeeklyInfo,
};
// createContext 参考
// https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const WeeklyContext = createContext<WeeklyInfo>(initWeeklyContext);

