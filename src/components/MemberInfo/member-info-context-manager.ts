import { createContext } from 'react';
import { MemberInfoMap } from '@common/member-info';
import { Category } from '@common/root';

export type MemberInfoListMap = {
    [Category.chara]: MemberInfoMap<Category.chara>;
    [Category.couple]: MemberInfoMap<Category.couple>;
    [Category.seiyuu]: MemberInfoMap<Category.seiyuu>;
}

export const initMemberInfoContext: MemberInfoListMap = {} as MemberInfoListMap;

export const MemberInfoContext = createContext<MemberInfoListMap>(initMemberInfoContext);
