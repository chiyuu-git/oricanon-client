import {
    Category,
    ProjectName,
    DateString,
} from '@common/root';
import {
    MemberInfoMap,
    GetMemberInfoByType,
} from '@common/member-info';
import { RecordTypeWeeklyInfo } from '@common/weekly';
import {
    CharaMemberIncrementInfo,
    HistoricalIncrementRank,
} from '@common/summary';
import { ProjectRecord, RecordType } from '@common/record';
import { formatDate } from '@utils/date';
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

export function reqProjectRelativeIncrementInfo(
    category: Category,
    projectName: ProjectName,
    from?: DateString,
    to?: DateString,
): Promise<CharaMemberIncrementInfo[]> {
    return enhanceFetch('/api/summary/project_relative_increment_info', {
        category,
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
    return enhanceFetch('/api/summary/relative_increment_in_range', {
        category,
        recordType,
        projectName,
        from,
        to,
    });
}

export function reHistoricalWeekIncrementOfPercentile(
    category: Category,
    recordType: RecordType,
    from?: DateString,
    to?: DateString,
    percentile = 80,
): Promise<number> {
    const lastYearDate = new Date();
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 2);
    return enhanceFetch('/api/summary/historical_week_increment_of_percentile', {
        category,
        recordType,
        from: formatDate(lastYearDate),
        to,
        percentile,
    });
}

export function reqWeekIncrementRankOfTypeInRange(
    category: Category,
    recordType: RecordType,
    from?: DateString,
    to?: DateString,
): Promise<HistoricalIncrementRank> {
    const lastYearDate = new Date();
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 2);
    return enhanceFetch('/api/summary/week_increment_rank_in_range', {
        category,
        recordType,
        from: formatDate(lastYearDate),
        to,
    });
}

export function reqRecordTypeWeekly<Type extends Category>(
    category: Type,
    recordType: RecordType,
    endDate = '',
): Promise<RecordTypeWeeklyInfo> {
    return enhanceFetch('/api/weekly/record_type_weekly', {
        category,
        recordType,
        endDate,
    });
}

export function reqMemberInfoMapOfCategory<Type extends Category>(
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
