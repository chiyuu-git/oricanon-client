import {
    BasicType,
    ProjectName,
    DateString,
} from '@common/root';
import {
    MemberInfoMap,
    GetMemberInfoByType,
} from '@common/member-info';
import { RecordWeeklyInfo } from '@common/weekly';
import { HistoricalIncrementRank } from '@common/summary';
import { ProjectRecord, RecordType } from '@common/record';
import { enhanceFetch } from './fetch';

export function reqRelativeIncrementOfTypeInRange(
    basicType: BasicType,
    recordType: RecordType,
    projectName: ProjectName,
    from?: DateString,
    to?: DateString,
): Promise<ProjectRecord[]> {
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
    recordType: RecordType,
    from?: DateString,
    to?: DateString,
): Promise<HistoricalIncrementRank> {
    return enhanceFetch('/api/summary/week_increment_rank_of_type_in_range', {
        basicType,
        recordType,
    });
}

export function reqRecordTypeWeekly<Type extends BasicType>(
    basicType: Type,
    recordType: RecordType,
    endDate = '',
): Promise<RecordWeeklyInfo> {
    return enhanceFetch('/api/weekly/record_type_weekly', {
        basicType,
        recordType,
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
        ? GetMemberInfoByType<R>[]
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
