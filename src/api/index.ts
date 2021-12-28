import {
    BasicType,
    InfoType,
    ProjectName,
    DateString,
    Record,
} from '@chiyu-bit/canon.root';
import {
    MemberInfoMap,
    MemberBasicInfo,
} from '@chiyu-bit/canon.root/member-info';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { HistoricalIncrementRank } from '@chiyu-bit/canon.root/summary';
import { enhanceFetch } from './fetch';

export function reqRelativeIncrementOfTypeInRange(
    basicType: BasicType,
    recordType: InfoType,
    projectName: ProjectName,
    from?: DateString,
    to?: DateString,
): Promise<Record[]> {
    return enhanceFetch('/api/summary/relative_increment_of_type_in_range', {
        basicType,
        recordType,
        projectName,
        from,
        to,
    });
}

export function reqWeekIncrementRankOfTypeInRange(
    basicType: BasicType,
    infoType: InfoType,
    from?: DateString,
    to?: DateString,
): Promise<HistoricalIncrementRank> {
    return enhanceFetch('/api/summary/week_increment_rank_of_type_in_range', {
        basicType,
        recordType: infoType,
    });
}

export function reqInfoTypeWeekly<Type extends BasicType>(
    basicType: Type,
    infoType: InfoType,
    endDate = '',
): Promise<RecordWeeklyInfo> {
    return enhanceFetch('/api/weekly/info_type_weekly', {
        basicType,
        infoType,
        endDate,
    });
}

export function reqMemberInfoMapOfType<Type extends BasicType>(
    type: Type,
): Promise<MemberInfoMap<Type>> {
    return enhanceFetch('/api/member_info/member_info_map', { type });
}

interface QueryMemberList {
    projectName: ProjectName;
    basicType: BasicType;
}

type ResMemberList<T extends QueryMemberList> = T extends { basicType: infer R; }
    ? R extends BasicType
        ? MemberBasicInfo<R>[]
        : never
    : never;

export function reqMemberList<T extends QueryMemberList>({
    projectName,
    basicType,
}: T): Promise<ResMemberList<T>> {
    return enhanceFetch('/api/member_info/member_info_of_type_and_project', {
        projectName,
        basicType,
    });
}
