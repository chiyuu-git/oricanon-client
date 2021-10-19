import { ProjectName } from '@chiyu-bit/canon.root';

interface ProjectInfo {
    projectName: ProjectName;
    projectTotal: number;
    projectWeekIncrease: number;
    projectIncreaseRate: string;
}

interface MemberWeekInfo {
    projectName: ProjectName;
    record: number;
    weekIncrease: number;
    weekIncreaseRate: string;
}

export interface ModuleInfo {
    projectInfo: ProjectInfo[];
    // TODO: 更准确的类型，难点在于处理函数返回值是联合类型
    // 考虑 类型谓语 锁定类型
    // 考虑 自然返回，不要限制类型，最终返回结果是啥就是啥？
    memberInfo: MemberWeekInfo[];
}
