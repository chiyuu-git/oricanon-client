import { ProjectName } from '@chiyu-bit/canon.root';

export type IncreaseRank = {
    projectName: ProjectName;
    name: string;
    romaName: string;
    supportColor?: string;
    increase: number;
    increaseRate: string;
}[];
