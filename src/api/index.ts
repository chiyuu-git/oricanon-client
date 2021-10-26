import { BasicType, ProjectName, RecordType } from '@chiyu-bit/canon.root';
import { CharacterInfo, CoupleInfo, SeiyuuInfo } from '@chiyu-bit/canon.root/member-list';
import { GetMemberInfo, ModuleInfo } from '@chiyu-bit/canon.root/weekly';
import { enhanceFetch } from './fetch';

/**
 * 查询周榜所需的数据
 * 不需要任何参数，后端直接返回周榜所需要的全部数据
 *
 * @returns
 */
export const reqWeeklyInfo = (endDate = '') => enhanceFetch('/api/weekly/weekly_info', { endDate });

interface QueryWeeklyInfoOfRecordType {
    basicType: BasicType;
    recordType: RecordType;
    endDate?: string;
}
export interface WeeklyInfo<Type extends BasicType> {
    range: string;
    recordWeekInfo: ModuleInfo<Type>;
}

// TODO: 两个ResXXX是否有办法合成一个？
type ResWeeklyInfo<T extends QueryWeeklyInfoOfRecordType> = T extends { basicType: infer R; }
    ? R extends BasicType
        ? WeeklyInfo<R>
        : never
    : never

export function reqWeeklyInfoOfRecordType<T extends QueryWeeklyInfoOfRecordType>({
    basicType,
    recordType,
    endDate = '',
}: T): Promise<ResWeeklyInfo<T>> {
    return enhanceFetch(
        '/api/weekly/weekly_info_of_record_type',
        { basicType, recordType, endDate },
    );
}

// TODO: 类型提升到root，同时完善 service findOne 的类型
interface QueryMemberList {
    projectName: ProjectName;
    type: BasicType;
}
export interface MemberList<Type extends BasicType> {
    projectName: ProjectName;
    list: GetMemberInfo<Type>[];
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

