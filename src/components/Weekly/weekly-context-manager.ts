import React, { createContext } from 'react';
import { Category } from '@common/root';
import { CharaRecordType, CoupleRecordType, SeiyuuRecordType } from '@common/record';
import { RecordTypeWeeklyInfo } from '@common/weekly';

type CharaRecordWeeklyInfo = Record<CharaRecordType, RecordTypeWeeklyInfo>

type CoupleRecordWeeklyInfo = Record<CoupleRecordType, RecordTypeWeeklyInfo>

type SeiyuuRecordWeeklyInfo = Record<SeiyuuRecordType, RecordTypeWeeklyInfo>;

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

