import React, { createContext } from 'react';
import { Category } from '@common/root';
import { CharaRecordType, CoupleRecordType, SeiyuuRecordType } from '@common/record';
import { RecordWeeklyInfo } from '@common/weekly';

type CharaRecordWeeklyInfo = Record<CharaRecordType, RecordWeeklyInfo>

type CoupleRecordWeeklyInfo = Record<CoupleRecordType, RecordWeeklyInfo>

type SeiyuuRecordWeeklyInfo = Record<SeiyuuRecordType, RecordWeeklyInfo>;

export type WeeklyInfo = {
    [Category.chara]: CharaRecordWeeklyInfo;
    [Category.couple]: CoupleRecordWeeklyInfo;
    [Category.seiyuu]: SeiyuuRecordWeeklyInfo;
};

export const initWeeklyContext: WeeklyInfo = {
    [Category.chara]: {} as CharaRecordWeeklyInfo,
    [Category.couple]: {} as CoupleRecordWeeklyInfo,
    [Category.seiyuu]: {} as SeiyuuRecordWeeklyInfo,
};
// createContext 参考
// https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const WeeklyContext = createContext<WeeklyInfo>(initWeeklyContext);

