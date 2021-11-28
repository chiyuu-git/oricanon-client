import { createContext } from 'react';
import { MemberInfoMap } from '@chiyu-bit/canon.root/member-list';
import { BasicType } from '@chiyu-bit/canon.root';

export type MemberInfoTypeMap = {
    [BasicType.character]: MemberInfoMap<BasicType.character>;
    [BasicType.couple]: MemberInfoMap<BasicType.couple>;
    [BasicType.seiyuu]: MemberInfoMap<BasicType.seiyuu>;
}

export const initMemberInfoContext: MemberInfoTypeMap = {} as MemberInfoTypeMap;

export const MemberInfoContext = createContext<MemberInfoTypeMap>(initMemberInfoContext);
