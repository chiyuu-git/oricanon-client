import { BasicType, InfoType, ProjectName } from '@chiyu-bit/canon.root';
import { MemberBasicInfo, RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { enhanceFetch } from './fetch';

interface QueryRecordTypeWeeklyInfo {
    basicType: BasicType;
    infoType: InfoType;
    endDate?: string;
}

// TODO: 两个ResXXX是否有办法合成一个？泛型函数没法透传，使用的时候必须传值
// TODO: 对象解构没办法返回精确的泛型
// type ResWeeklyInfo<T extends QueryRecordTypeWeeklyInfo> = T extends { basicType: infer R; }
//     ? R extends BasicType
//         ? RecordWeeklyInfo<R>
//         : never
//     : never

// export function reqRecordWeeklyInfo<T extends QueryRecordTypeWeeklyInfo>({
//     basicType,
//     infoType,
//     endDate = '',
// }: T): Promise<ResWeeklyInfo<T>> {
//     return enhanceFetch(
//         '/api/weekly/weekly_info_of_record_type',
//         { basicType, infoType, endDate },
//     );
// }

export function reqRecordWeeklyInfo<Type extends BasicType>(
    basicType: Type,
    infoType: InfoType,
    endDate = '',
): Promise<RecordWeeklyInfo<Type>> {
    return enhanceFetch(
        '/api/weekly/weekly_info_of_record_type',
        { basicType, infoType, endDate },
    );
}

// TODO: 类型提升到root，同时完善 service findOne 的类型
interface QueryMemberList {
    projectName: ProjectName;
    type: BasicType;
}
export interface MemberList<Type extends BasicType> {
    projectName: ProjectName;
    list: MemberBasicInfo<Type>[];
}
type ResMemberList<T extends QueryMemberList> = T extends { type: infer R; }
    ? R extends BasicType
        ? MemberList<R>
        : never
    : never

export function reqMemberList<T extends QueryMemberList>({ projectName, type }: T): Promise<ResMemberList<T>> {
    return enhanceFetch(
        '/api/member_list/member_list',
        { projectName, type },
    );
}

