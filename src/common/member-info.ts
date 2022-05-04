import { Category, ProjectName } from './root';

export enum GroupName {
    muses = 'muses',
    aqours = 'aqours',
    nijigaku = 'nijigaku',
    liella = 'liella',
}

export interface MemberCommonInfo {
    memberId: number;
    projectName: ProjectName;
    name: string;
    /**
     * 角色的罗马音简称 e.g: honoka
     */
    romaName: string;
    supportColor: string;
}

export interface CharaInfo extends MemberCommonInfo {
    pixivTag: string;
    birthday: string;
    recordOrder: number;
}
export interface CoupleInfo extends MemberCommonInfo {
    pixivTag: string;
    pixivReverseTag: string;
    // pixivIntersectionTag 由前两个字段计算得出即可
    // pixivIntersectionTag: string;
}
export interface SeiyuuInfo extends MemberCommonInfo{
    twitterAccount: string;
    recordOrder: number;
}

export type GetMemberInfoByType<Type extends Category> = Type extends Category.chara
    ? CharaInfo
    : Type extends Category.couple
        ? CoupleInfo
        : Type extends Category.seiyuu
            ? SeiyuuInfo
            : never

export type MemberInfoMap<Type extends Category > = {
    [romaName in string]: GetMemberInfoByType<Type>
}
