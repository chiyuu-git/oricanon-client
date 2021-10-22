import { BasicType, ProjectName } from '@chiyu-bit/canon.root';
import { CharacterInfo, CoupleInfo, SeiyuuInfo } from '@chiyu-bit/canon.root/member-list';
import { GetMemberInfo } from '@chiyu-bit/canon.root/weekly';
import { enhanceFetch } from './fetch';

/**
 * 查询周榜所需的数据
 * 不需要任何参数，后端直接返回周榜所需要的全部数据
 *
 * @returns
 */
export const reqWeeklyInfo = () => enhanceFetch('/api/weekly/weekly_info');

// TODO: 类型提升到root，同时完善 service findOne 的类型
interface QueryMemberListDto {
    projectName: ProjectName;
    type: BasicType;
}
export interface MemberList<Type extends BasicType> {
    projectName: ProjectName;
    list: GetMemberInfo<Type>[];
}
type ResMemberList<T extends QueryMemberListDto> = T extends { type: infer R; }
    ? R extends BasicType
        ? MemberList<R>
        : never
    : never

export function reqMemberList<T extends QueryMemberListDto>({ projectName, type }: T): Promise<ResMemberList<T>> {
    return enhanceFetch(
        '/api/member_list/member_list',
        { projectName, type },
    );
}

