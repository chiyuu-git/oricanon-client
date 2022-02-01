import React, { FC, useEffect, useReducer, useRef } from 'react';
import { BasicType } from '@common/root';

import { reqMemberInfoMapOfType } from '@src/api';
import { MemberInfoMap } from '@common/member-info';
import { MemberInfoContext, initMemberInfoContext, MemberInfoListMap } from './member-info-context-manager';

import Weekly from '../Weekly/Weekly';
import Summary from '../Summary/Summary';

type MemberInfoActionInfoMap = {
    [BasicType.chara]: {
        memberInfoMap: MemberInfoMap<BasicType.chara>;
    };
    [BasicType.couple]: {
        memberInfoMap: MemberInfoMap<BasicType.couple>;
    };
    [BasicType.seiyuu]: {
        memberInfoMap: MemberInfoMap<BasicType.seiyuu>;
    };
}

type MemberInfoActionInfo<T> = T extends keyof MemberInfoActionInfoMap
    ? MemberInfoActionInfoMap[T]
    : any;

type MemberInfoAction = {
    [key in keyof typeof BasicType]: {
        basicType: typeof BasicType[key];
        payload: MemberInfoActionInfo<typeof BasicType[key]>;
    };
}[keyof typeof BasicType];

function memberInfoContextReducer(state: MemberInfoListMap, action: MemberInfoAction): MemberInfoListMap {
    switch (action.basicType) {
        case BasicType.chara:
            return {
                ...state,
                [BasicType.chara]: action.payload.memberInfoMap,
            };
        case BasicType.couple:
            return {
                ...state,
                [BasicType.couple]: action.payload.memberInfoMap,
            };
        case BasicType.seiyuu:
            return {
                ...state,
                [BasicType.seiyuu]: action.payload.memberInfoMap,
            };

        default:
            return state;
    }
}

const MemberInfo: FC<unknown> = ({ children }) => {
    const [memberInfoContext, dispatchMemberInfoContext] = useReducer(memberInfoContextReducer, initMemberInfoContext);

    // 获取 各基础类型的 memberInfo
    useEffect(() => {
        for (const basicType of Object.values(BasicType)) {
            reqMemberInfoMapOfType(basicType)
                .then((memberInfoMap) => {
                    dispatchMemberInfoContext({
                        basicType,
                        payload: {
                            memberInfoMap,
                        },
                    });
                    return true;
                })
                .catch((error) => console.log(error));
        }
    }, []);

    return (
        <MemberInfoContext.Provider value = { memberInfoContext }>
            <Summary />
            { /* <Weekly /> */ }
        </MemberInfoContext.Provider>
    );
};

export default MemberInfo;
