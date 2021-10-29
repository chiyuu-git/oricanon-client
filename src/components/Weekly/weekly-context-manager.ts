import React, { createContext } from 'react';
import { BasicType } from '@chiyu-bit/canon.root';
import {
    CharaRecordWeeklyInfo,
    CoupleRecordWeeklyInfo,
    SeiyuuRecordWeeklyInfo,
    WeeklyInfo,
} from '@chiyu-bit/canon.root/weekly';

export const initWeeklyContext = {
    [BasicType.character]: {} as CharaRecordWeeklyInfo,
    [BasicType.couple]: {} as CoupleRecordWeeklyInfo,
    [BasicType.seiyuu]: {} as SeiyuuRecordWeeklyInfo,
};
// createContext 参考
// https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const WeeklyContext = createContext<WeeklyInfo>(initWeeklyContext);
