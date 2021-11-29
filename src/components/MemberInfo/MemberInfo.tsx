import React, { FC, useEffect, useReducer, useRef } from 'react';
import { BasicType } from '@chiyu-bit/canon.root';

import { reqMemberInfoMapOfType } from '@src/api';
import { MemberInfoMap } from '@chiyu-bit/canon.root/member-list';
import { MemberInfoContext, initMemberInfoContext, MemberInfoTypeMap } from './member-info-context-manager';

import Weekly from '../Weekly/Weekly';

type MemberInfoActionInfoMap = {
    [BasicType.character]: {
        memberInfoMap: MemberInfoMap<BasicType.character>;
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

function memberInfoContextReducer(state: MemberInfoTypeMap, action: MemberInfoAction): MemberInfoTypeMap {
    switch (action.basicType) {
        case BasicType.character:
            return {
                ...state,
                [BasicType.character]: action.payload.memberInfoMap,
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

const MemberInfo: FC<unknown> = () => {
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
            <Weekly />
        </MemberInfoContext.Provider>
    );
};

export default MemberInfo;