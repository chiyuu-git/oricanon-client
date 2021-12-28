import { BasicType, ProjectName } from '@chiyu-bit/canon.root';
import { MemberInfoMap } from '@chiyu-bit/canon.root/member-info';
import { MemberWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { HistoricalIncrementRank, MemberIncrementInfo } from '@chiyu-bit/canon.root/summary';

export type IncrementRank = {
    projectName: ProjectName;
    nameAndRoma: string;
    increment: number;
    incrementRateStr: string;
}[];

/**
 * 接受一个已排序的数组，返回对应百分位的数值
 *
 * @param percentile 表示百分位的小数
 */
function getPercentile(array: number[], percentile: number) {
    const len = array.length;
    const percentileIndex = (len + 1) * percentile;

    if (Number.isInteger(percentileIndex)) {
        // index 是整数
        return array[percentileIndex];
    }

    // 非整数
    const integer = Math.floor(percentileIndex);
    const decimal = percentileIndex - integer;
    const result = array[integer] + decimal * (array[integer + 1] - array[integer]);
    return +result.toFixed(2);
}

function getHistoricalIncrementRankPercentile(incrementRank: MemberIncrementInfo[], percentile: number) {
    const incrementArray = incrementRank.map((memberInfo) => memberInfo.increment);
    return getPercentile(incrementArray, percentile);
}

export function getWeekIncrementRank<Type extends BasicType>(
    memberInfoMap: MemberInfoMap<Type>,
    memberWeeklyInfoList: MemberWeeklyInfo[],
    historicalIncrementRank?: HistoricalIncrementRank,
) {
    // TODO: remove any
    let eightyPercentile = {} as MemberWeeklyInfo;
    if (historicalIncrementRank) {
        // 长草期，参考历史分位
        // 与历史 80分位 做对比，历史 80分位 属于表现良好，历史 95分位，表现优异
        const historical80 = getHistoricalIncrementRankPercentile(historicalIncrementRank.historical, 0.8);
        eightyPercentile = {
            weekIncrement: historical80,
        } as MemberWeeklyInfo;
    }

    // 返回值只是普通的 incrementRank
    const weekIncrementRank = [...memberWeeklyInfoList, eightyPercentile]
        .sort((a, b) => a.weekIncrement - b.weekIncrement)
        .map((memberWeeklyInfo, index) => {
            const { romaName, weekIncrement, weekIncrementRate } = memberWeeklyInfo;
            const memberInfo = memberInfoMap[romaName];
            // 百分位没有对应的 basicInfo
            if (!memberInfo) {
                return {
                    nameAndRoma: '',
                    increment: weekIncrement < 0 ? 0 : weekIncrement,
                    projectName: '' as ProjectName,
                    incrementRateStr: '年内全企划周增量80分位',
                };
            }
            const { name, projectName } = memberInfo;

            // 第一位注释为先周比
            let rateStr = weekIncrementRate || '-';
            // 比 memberInfoList 多了一个百分位元素
            if (index === memberWeeklyInfoList.length) {
                rateStr = `先周比：${rateStr}`;
            }

            if (projectName) {
                rateStr = `(${rateStr})`;
            }

            return {
                nameAndRoma: `${name}-${romaName}`,
                increment: weekIncrement < 0 ? 0 : weekIncrement,
                projectName,
                incrementRateStr: rateStr,
            };
        });

    return weekIncrementRank;
}

