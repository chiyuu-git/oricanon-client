import React, { FC, useEffect, useReducer, useRef } from 'react';
import { Category } from '@common/root';

import { reqMemberInfoMapOfType } from '@src/api';
import { MemberInfoMap } from '@common/member-info';
import { MemberInfoContext, initMemberInfoContext, MemberInfoListMap } from './member-info-context-manager';

import Weekly from '../Weekly/Weekly';
import Summary from '../Summary/Summary';

type MemberInfoActionInfoMap = {
    [Category.chara]: {
        memberInfoMap: MemberInfoMap<Category.chara>;
    };
    [Category.couple]: {
        memberInfoMap: MemberInfoMap<Category.couple>;
    };
    [Category.seiyuu]: {
        memberInfoMap: MemberInfoMap<Category.seiyuu>;
    };
}

type MemberInfoActionInfo<T> = T extends keyof MemberInfoActionInfoMap
    ? MemberInfoActionInfoMap[T]
    : any;

type MemberInfoAction = {
    [key in keyof typeof Category]: {
        category: typeof Category[key];
        payload: MemberInfoActionInfo<typeof Category[key]>;
    };
}[keyof typeof Category];

function memberInfoContextReducer(state: MemberInfoListMap, action: MemberInfoAction): MemberInfoListMap {
    switch (action.category) {
        case Category.chara:
            return {
                ...state,
                [Category.chara]: action.payload.memberInfoMap,
            };
        case Category.couple:
            return {
                ...state,
                [Category.couple]: action.payload.memberInfoMap,
            };
        case Category.seiyuu:
            return {
                ...state,
                [Category.seiyuu]: action.payload.memberInfoMap,
            };

        default:
            return state;
    }
}

const MemberInfo: FC<unknown> = ({ children }) => {
    const [memberInfoContext, dispatchMemberInfoContext] = useReducer(memberInfoContextReducer, initMemberInfoContext);

    // 获取 各基础类型的 memberInfo
    useEffect(() => {
        for (const category of Object.values(Category)) {
            reqMemberInfoMapOfType(category)
                .then((memberInfoMap) => {
                    dispatchMemberInfoContext({
                        category,
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
        <MemberInfoContext.Provider value = {memberInfoContext}>
            <Summary />
            {/* <Weekly /> */}
        </MemberInfoContext.Provider>
    );
};

export default MemberInfo;
