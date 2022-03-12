/**
 * 事件展示组件
 * 接受一个 日期字符串，展示到上周抓取日为止最近的新闻
 * 接受一个 duration，在 duration 内完成全部新闻的展示工作
 * 如果有相应的事件，则展示事件的日期
 * 如果没有事件，则展示接受到的日期字符串
 */

import React, { FC, useEffect, useMemo, useState } from 'react';
import { getWeeklyFetchDate } from '@common/weekly';
import { EventInfo, WeeklyEventMap } from '@common/event-record';

import './EventFlow.less';

interface EventFlowProps {
    curDateStr: string;
    weeklyEventMap: WeeklyEventMap;
    duration?: number;
}

const EventFlow: FC<EventFlowProps> = ({ curDateStr, weeklyEventMap, duration = 3000 }) => {
    const [fetchDate, setFetchDate] = useState<string | null>(null);
    const [weeklyEvent, setWeeklyEvent] = useState<EventInfo[] | null>(null);

    useEffect(() => {
        const curFetchDate = getWeeklyFetchDate(curDateStr);
        if (fetchDate !== curFetchDate) {
            const eventRecord = weeklyEventMap[curFetchDate];
            setFetchDate(curFetchDate);
            setWeeklyEvent(eventRecord);
        }
    }, [curDateStr, fetchDate, weeklyEventMap]);

    return useMemo(() => {
        if (!weeklyEvent) {
            return (
                <div className = 'event-flow-container'>
                    <div className = 'event-date'>{fetchDate}</div>
                </div>
            );
        }

        function renderEventWithAnimation(event: EventInfo[]) {
            const itemDuration = duration / event.length;
            return event.map(({ date, title }, index) => {
                const animateConfig = {
                    animationDuration: `${itemDuration}ms`,
                    animationDelay: `${index * itemDuration}ms`,
                };

                return (
                    <div key = {title} className = 'event-info-container'>
                        <div
                            style = {animateConfig}
                            className = {`event-date ${index === event.length - 1
                                ? 'event-date-fade-in'
                                : 'event-date-fade-in-and-out'}`}
                        >
                            {date || fetchDate}
                        </div>
                        <div
                            style = {animateConfig}
                            className = 'event-detail-container'
                        >
                            <div className = 'event-title'>{title}</div>
                            <img
                                src = {`/api/assets/event/${date}/${1}.jfif`}
                                style = {{
                                    width: '100%',
                                }}
                                alt = {title}
                            />
                        </div>

                    </div>
                );
            });
        }

        return (
            <div className = 'event-flow-container'>
                {renderEventWithAnimation(weeklyEvent)}
            </div>
        );
    }, [fetchDate, weeklyEvent, duration]);
};

export default EventFlow;
