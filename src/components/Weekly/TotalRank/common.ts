import { ProjectName } from '@common/root';

export type TotalRank = {
    name: string;
    projectName: ProjectName;
    record: number;
    increment: number;
}[];
