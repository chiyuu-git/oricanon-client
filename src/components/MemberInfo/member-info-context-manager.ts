import { createContext } from 'react';
import { MemberInfoMap } from '@chiyu-bit/canon.root/member-info';
import { BasicType } from '@chiyu-bit/canon.root';

export type MemberInfoListMap = {
    [BasicType.chara]: MemberInfoMap<BasicType.chara>;
    [BasicType.couple]: MemberInfoMap<BasicType.couple>;
    [BasicType.seiyuu]: MemberInfoMap<BasicType.seiyuu>;
}

export const initMemberInfoContext: MemberInfoListMap = {} as MemberInfoListMap;

export const MemberInfoContext = createContext<MemberInfoListMap>(initMemberInfoContext);
