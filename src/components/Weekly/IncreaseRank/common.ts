import { ProjectName, BasicType } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';

export type IncreaseRank = {
    projectName: ProjectName;
    nameAndRoma: string;
    supportColor?: string;
    increase: number;
    increaseRate: string;
}[];

export function getIncreaseRank(recordWeeklyInfo: RecordWeeklyInfo<BasicType.character | BasicType.seiyuu>) {
    const RecordMemberInfo = recordWeeklyInfo.memberInfo;

    const increaseRank = [...RecordMemberInfo]
        .sort((a, b) => a.weekIncrease - b.weekIncrease)
        .map((memberInfo) => {
            const { name, romaName, weekIncrease, projectName, weekIncreaseRate } = memberInfo;
            return {
                nameAndRoma: `${name}-${romaName}`,
                increase: weekIncrease < 0 ? 0 : weekIncrease,
                projectName,
                increaseRate: weekIncreaseRate || '-',
            };
        });
    return increaseRank;
}
