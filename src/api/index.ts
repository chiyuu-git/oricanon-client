import {
    Category,
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

export function reqWeekIncrementOfProjectInRange(
    category: Category,
    recordType: RecordType,
    projectName: ProjectName,
    from?: DateString,
    to?: DateString,
): Promise<ProjectRecord[]> {
    return enhanceFetch('/api/summary/week_increment_of_project_in_range', {
        category,
        recordType,
        projectName,
        from,
        to,
    });
}

export function reqRelativeIncrementOfTypeInRange(
    category: Category,
    recordType: RecordType,
    projectName: ProjectName,
    from?: DateString,
    to?: DateString,
): Promise<ProjectRecord[]> {
    return enhanceFetch('/api/summary/relative_increment_of_type_in_range', {
        category,
        recordType,
        projectName,
        from,
        to,
    });
}

export function reqWeekIncrementRankOfTypeInRange(
    category: Category,
    recordType: RecordType,
    from: DateString = '2020-06-06',
    to?: DateString,
): Promise<HistoricalIncrementRank> {
    return enhanceFetch('/api/summary/week_increment_rank_of_type_in_range', {
        category,
        recordType,
        from,
        to,
    });
}

export function reqRecordTypeWeekly<Type extends Category>(
    category: Type,
    recordType: RecordType,
    endDate = '',
): Promise<RecordWeeklyInfo> {
    return enhanceFetch('/api/weekly/record_type_weekly', {
        category,
        recordType,
        endDate,
    });
}

export function reqMemberInfoMapOfType<Type extends Category>(
    type: Type,
): Promise<MemberInfoMap<Type>> {
    return enhanceFetch('/api/member_info/member_info_map', { type });
}

interface QueryMemberList {
    projectName: ProjectName;
    category: Category;
}

type ResMemberList<T extends QueryMemberList> = T extends { category: infer R; }
    ? R extends Category
        ? GetMemberInfoByType<R>[]
        : never
    : never;

export function reqMemberList<T extends QueryMemberList>({
    projectName,
    category,
}: T): Promise<ResMemberList<T>> {
    return enhanceFetch('/api/member_info/project_member_info_of_category', {
        projectName,
        category,
    });
}
