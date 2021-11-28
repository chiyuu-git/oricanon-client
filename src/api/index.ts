import { BasicType, InfoType, ProjectName, DateString } from '@chiyu-bit/canon.root';
import { MemberBasicInfo, MemberInfoMap } from '@chiyu-bit/canon.root/member-list';
import { RecordWeeklyInfo, HistoricalIncrementRank } from '@chiyu-bit/canon.root/weekly';
import { enhanceFetch } from './fetch';

export function reqIncrementRankOfTypeInRange(
    basicType: BasicType,
    infoType: InfoType,
    from?: DateString,
    to?: DateString,
): Promise<HistoricalIncrementRank> {
    return enhanceFetch(
        '/api/weekly/increment_rank_of_type_in_range',
        { basicType, recordType: infoType },
    );
}

export function reqInfoTypeWeekly<Type extends BasicType>(
    basicType: Type,
    infoType: InfoType,
    endDate = '',
): Promise<RecordWeeklyInfo<Type>> {
    return enhanceFetch(
        '/api/weekly/info_type_weekly',
        { basicType, infoType, endDate },
    );
}

export function reqMemberInfoMapOfType<Type extends BasicType>(type: Type): Promise<MemberInfoMap<Type>> {
    return enhanceFetch(
        '/api/member_list/member_info_map',
        { type },
    );
}

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

