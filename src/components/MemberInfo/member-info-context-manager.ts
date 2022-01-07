import { createContext } from 'react';
import { MemberInfoMap } from '@common/member-info';
import { BasicType } from '@common/root';

export type MemberInfoListMap = {
    [BasicType.chara]: MemberInfoMap<BasicType.chara>;
    [BasicType.couple]: MemberInfoMap<BasicType.couple>;
    [BasicType.seiyuu]: MemberInfoMap<BasicType.seiyuu>;
}

export const initMemberInfoContext: MemberInfoListMap = {} as MemberInfoListMap;

export const MemberInfoContext = createContext<MemberInfoListMap>(initMemberInfoContext);
