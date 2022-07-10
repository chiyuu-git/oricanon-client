import React, { createContext } from 'react';
import { Category } from '@common/root';
import { CharaRecordType, CoupleRecordType, PersonRecordType } from '@common/record';
import { RecordTypeWeeklyInfo } from '@common/weekly';

type CharaRecordWeeklyInfo = Record<CharaRecordType, RecordTypeWeeklyInfo>

type CoupleRecordWeeklyInfo = Record<CoupleRecordType, RecordTypeWeeklyInfo>

type PersonRecordWeeklyInfo = Record<PersonRecordType, RecordTypeWeeklyInfo>;

export type WeeklyInfo = {
    [Category.chara]: CharaRecordWeeklyInfo;
    [Category.couple]: CoupleRecordWeeklyInfo;
    [Category.person]: PersonRecordWeeklyInfo;
};

export const initWeeklyContext: WeeklyInfo = {
    [Category.chara]: {} as CharaRecordWeeklyInfo,
    [Category.couple]: {} as CoupleRecordWeeklyInfo,
    [Category.person]: {} as PersonRecordWeeklyInfo,
};
// createContext 参考
// https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const WeeklyContext = createContext<WeeklyInfo>(initWeeklyContext);

