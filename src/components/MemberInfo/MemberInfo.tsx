import React, { FC, useEffect, useReducer, useRef } from 'react';
import { Category } from '@common/root';

import { reqMemberInfoMapOfCategory } from '@src/api';
import { MemberInfoMap } from '@common/member-info';
import Annual from '@components/Summary/Annual/Annual';
import Transition from '@components/Summary/Transition/Transition';
import Guide from '@components/Summary/Transition/Guide';
import MonthlyCouple from '@components/Monthly/Couple';
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
    [Category.person]: {
        memberInfoMap: MemberInfoMap<Category.person>;
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
        case Category.person:
            return {
                ...state,
                [Category.person]: action.payload.memberInfoMap,
            };

        default:
            return state;
    }
}

const MemberInfo: FC<unknown> = function () {
    const [memberInfoContext, dispatchMemberInfoContext] = useReducer(memberInfoContextReducer, initMemberInfoContext);

    // 获取 各基础类型的 memberInfo
    useEffect(() => {
        for (const category of Object.values(Category)) {
            reqMemberInfoMapOfCategory(category)
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
            {/* <Summary /> */}
            {/* <Weekly /> */}
            {/* <Annual /> */}
            {/* <Transition /> */}
            {/* <Guide /> */}
            <MonthlyCouple />
        </MemberInfoContext.Provider>
    );
};

export default MemberInfo;
