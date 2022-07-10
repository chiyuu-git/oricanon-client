/**
 * BarRaceWithEventFLow，包含了 barRace 和 EventFlow ，以及控制器三个模块
 * 1. 通过 DateController 控制 barRace 和 eventFLow 更新
 * 2. 每一周展示的时间是固定的 3000ms，同时是 bar 的 transition duration、autoplay interval、eventFLow duration
 * 3. eventFLow 自行控制事件的展示和消失，当一周内有多个事件时，平分 3000ms 的时长
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Category, ProjectName } from '@common/root';
import { CharaRecordType, PersonRecordType } from '@common/record';
import { getWeeklyFetchDate } from '@common/weekly';
import { WeeklyEventMap } from '@common/event-record';
import { reqMemberList, reqRelativeIncrementOfTypeInRange } from '@src/api';

import BarRace from './BarRace';
import { RecordList } from './common';

import DateController from './DateController';
import EventFlow from './EventFlow';
import { eventList } from './event-record';

const DURATION = 300;

const TwitterFollowerBarRace = () => {
    const [category, setCategory] = useState<string[] | null>(null);
    const [recordList, setRecordList] = useState<RecordList | null>(null);
    const [dateList, setDateList] = useState<string[] | null>(null);
    const [dateIndex, setDateIndex] = useState(0);
    const [weeklyEventMap, setWeeklyEventMap] = useState<WeeklyEventMap | null>(null);

    useEffect(() => {
        async function getRecordOfTypeInRange() {
            const personRecord = await reqRelativeIncrementOfTypeInRange(
                Category.chara,
                // PersonRecordType.twitterFollower,
                CharaRecordType.illust,
                ProjectName.llss,
                '2022-04-01',
                '2022-06-18',
            );

            const liellaPersonList = await reqMemberList({
                projectName: ProjectName.llss,
                category: Category.chara,
            });

            const personCategory = liellaPersonList.map(({ name, romaName }) => `${name}-${romaName}`);

            const tempDataList: string[] = [];
            const tempRecordList: number[][] = [];

            for (const { date, records } of personRecord) {
                tempDataList.push(date);
                tempRecordList.push(records);
            }

            setCategory(personCategory);
            setDateList(tempDataList);
            setRecordList(tempRecordList);
        }
        getRecordOfTypeInRange();
    }, []);

    useEffect(() => {
        // TODO: 后端生成 weeklyEventMap
        const eventMap: WeeklyEventMap = {};
        for (const [eventDateStr, eventInfo] of Object.entries(eventList)) {
            const fetchDateStr = getWeeklyFetchDate(eventDateStr);

            if (eventMap[fetchDateStr]) {
                eventMap[fetchDateStr].push(eventInfo);
            }
            else {
                eventMap[fetchDateStr] = [eventInfo];
            }
        }
        setWeeklyEventMap(eventMap);
    }, []);
    return useMemo(() => {
        if (!category || !recordList || !dateList || !weeklyEventMap) {
            return (
                <div>
                    TwitterFollowerBarRace
                </div>
            );
        }

        const maxIndex = recordList && recordList.length - 1;

        return (
            <div className = 'race-container'>
                <div
                    style = {{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <BarRace
                        category = {category}
                        recordList = {recordList}
                        curIndex = {dateIndex}
                        dataUpdateInterval = {DURATION}
                    />
                    <EventFlow
                        weeklyEventMap = {weeklyEventMap}
                        curDateStr = {dateList[dateIndex]}
                    />
                </div>
                <div className = 'timeline-controller'>
                    <DateController
                        dateList = {dateList}
                        dateIndex = {dateIndex}
                        min = {0}
                        max = {maxIndex}
                        setDateIndex = {setDateIndex}
                        playOption = {{
                            interval: DURATION,
                        }}
                    />
                </div>
            </div>
        );
    }, [category, recordList, dateList, dateIndex, weeklyEventMap]);
};

export default TwitterFollowerBarRace;

