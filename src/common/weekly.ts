import { formatDate } from '@utils/date';
import { ProjectName } from './root';

interface ProjectInfo {
    projectName: ProjectName;
    projectTotal: number;
    projectWeekIncrement: number;
    projectWeekIncrementRate: string;
}

export type MemberWeeklyInfo = {
    romaName: string;
    record: number;
    weekIncrement: number;
    weekIncrementRate: string;
}

export interface RecordWeeklyInfo {
    range: string;
    projectInfoList: ProjectInfo[];
    memberInfoList: MemberWeeklyInfo[];
}

/**
 * 如果是9-25，本质还是9-18的lastRecord
 * baseDate 是9-18 fetchDay 应该是 5
 * 只要是小于9-18的 都是 6
 *
 * @private
 * @param {Date} date
 * @return {string} weekday
 */
function getFetchWeekDay(date: Date) {
    const breakChangeDate = new Date('2020-09-18');
    if (date > breakChangeDate) {
        return 5;
    }
    return 6;
}

/**
 * 接受 base，返回last
 * 为了方便回顾每周的，需要方便的查看每一周的数据，因此是以周为单位的
 *
 * @private
 * @param {string} base YYYY-MM-DD
 * @return {string} last YYYY-MM-DD
 */
export function getPrevWeeklyFetchDate(base: string) {
    const baseDate = new Date(base);
    const fetchWeekDay = getFetchWeekDay(baseDate);
    const baseWeekday = baseDate.getDay();

    let diff = 0;
    // 如果是星期天，则上个抓取日在本周
    // 今天是星期天，上个抓取日是本周五，diff 为 2 天
    if (baseWeekday === 0) {
        diff = 7 - fetchWeekDay;
    }
    // 如果大于 fetchWeekday ，则上抓取日在本周
    // 今天是星期六，上个抓取日是本周五，diff 为 1 天
    else if (baseWeekday > fetchWeekDay) {
        diff = baseWeekday - fetchWeekDay;
    }
    // 如果是小于等于 fetchWeekday，则上抓取日在上周
    // 今天是星期一，上个抓取日为上周五，diff 为 2 + 1 天
    else if (baseWeekday <= fetchWeekDay) {
        diff = 7 - fetchWeekDay + baseWeekday;
    }
    // 重设抓取日的日期
    const lastFetchDate = new Date(baseDate);
    lastFetchDate.setDate(lastFetchDate.getDate() - diff);
    return formatDate(lastFetchDate);
}

function getNextWeeklyFetchDate(base: string) {
    const baseDate = new Date(base);
    const fetchWeekDay = getFetchWeekDay(baseDate);
    const baseWeekday = baseDate.getDay();

    let diff = 0;
    // 如果是星期天，则下个抓取日在下周
    // 今天是星期天，下个抓取日是下周五，diff 为 5 天
    if (baseWeekday === 0) {
        diff = baseWeekday + fetchWeekDay;
    }
    // 如果大于 fetchWeekday ，则下抓取日在下周
    // 今天是星期六，下个抓取日是下周五，diff 为 1 + 5 天
    else if (baseWeekday > fetchWeekDay) {
        diff = 7 - baseWeekday + fetchWeekDay;
    }
    // 如果是小于等于 fetchWeekday ，则下抓取日在本周
    // 今天是星期一，下个抓取日为本周五，diff 为 4 天
    else if (baseWeekday <= fetchWeekDay) {
        diff = fetchWeekDay - baseWeekday;
    }
    // 重设抓取日的日期
    const lastFetchDate = new Date(baseDate);
    lastFetchDate.setDate(lastFetchDate.getDate() + diff);
    return formatDate(lastFetchDate);
}

/**
 * 判断日期是否在 weekly 区间内
 * 如果 dateString 刚好是 fetchDate ，则 dateString 会等于 nextWeeklyFetchDate
 * 所以新闻的范围是右闭合的，可以等于 endDate，但是不能等于 startDate
 */
export const isDateBetweenWeeklyRange = function (
    date: string,
    startDate: string,
    endDate: string,
) {
    const targetTime = new Date(date);
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    if (targetTime > startTime && targetTime <= endTime) {
        return true;
    }
    return false;
};

/**
 * 判断 date 是否是 fetchDate
 */
export function isFetchDate(dateStr: string | Date) {
    const date = new Date(dateStr);
    return date.getDay() === getFetchWeekDay(date);
}

/**
 * 获取 date 所属的周期内的 fetchDate
 */
export function getWeeklyFetchDate(dateStr: string) {
    return isFetchDate(dateStr)
        // fetchDate 当天，属于自身的周期内
        ? dateStr
        // 非 fetchDate，一律属于nextFetchDate
        : getNextWeeklyFetchDate(dateStr);
}
