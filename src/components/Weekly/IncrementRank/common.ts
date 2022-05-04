import { Category } from '@common/root';
import { MemberInfoMap } from '@common/member-info';
import { MemberWeeklyInfo } from '@common/weekly';

export type IncrementRankInfo = {
    romaName: string;
    increment: number;
    incrementRateStr: string;
}[];

export function getWeekIncrementRank<Type extends Category>(
    memberInfoMap: MemberInfoMap<Type>,
    memberWeeklyInfoList: MemberWeeklyInfo[],
    percentile?: number[],
) {
    const referenceList: MemberWeeklyInfo[] = [];
    if (percentile) {
        // 长草期，参考历史分位
        // 与历史 80分位 做对比，历史 80分位 属于表现良好，历史 95分位，表现优异
        for (const increment of percentile) {
            referenceList.push({
                weekIncrement: increment,
            }as MemberWeeklyInfo);
        }
    }

    // 返回值只是普通的 incrementRank
    const weekIncrementRank = [...memberWeeklyInfoList, ...referenceList]
        .sort((a, b) => a.weekIncrement - b.weekIncrement)
        .map((memberWeeklyInfo, index) => {
            const { romaName, weekIncrement, weekIncrementRate } = memberWeeklyInfo;
            const memberInfo = memberInfoMap[romaName];
            // 百分位没有对应的 basicInfo
            if (!memberInfo) {
                return {
                    romaName: '',
                    increment: weekIncrement < 0 ? 0 : weekIncrement,
                    incrementRateStr: '年内全企划周增量80分位',
                };
            }
            const { projectName } = memberInfo;

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
                romaName,
                increment: weekIncrement < 0 ? 0 : weekIncrement,
                incrementRateStr: rateStr,
            };
        });

    return weekIncrementRank;
}

