import React, { useState, useEffect, useReducer } from 'react';

import { AggregationType, BasicType, CharacterRecordType, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import {
    CharaRecordWeeklyInfo,
    CoupleRecordWeeklyInfo,
    RecordWeeklyInfo,
    SeiyuuRecordWeeklyInfo,
    WeeklyInfo,
} from '@chiyu-bit/canon.root/weekly';
import { reqRecordWeeklyInfo, reqRecordWeeklyInfoTest } from '@src/api';
import { WeeklyContext, initWeeklyContext } from './weekly-context-manager';

import CoupleCircle from './CoupleCircle';
import CharaIllustIncreaseRank from './IncreaseRank/PixivIllustIncreaseRank';
import TwitterFollowerIncreaseRank from './IncreaseRank/TwitterFollowerIncreaseRank';
import PixivIllustTotalRank from './TotalRank/PixivIllustTotalRank';
import TwitterFollowerTotalRank from './TotalRank/TwitterFollowerTotalRank';
import BasicProjectPie from './ProjectPie/BasicProjectPie';
import CompareProjectPie from './ProjectPie/CompareProjectPie';

import './index.less';

type WeeklyAction = {
    basicType: BasicType.character;
    infoType: CharacterRecordType | AggregationType;
    recordWeeklyInfo: RecordWeeklyInfo<BasicType.character>;
} | {
    basicType: BasicType.couple;
    infoType: CharacterRecordType | AggregationType;
    recordWeeklyInfo: RecordWeeklyInfo<BasicType.couple>;
} | {
    basicType: BasicType.seiyuu;
    infoType: SeiyuuRecordType;
    recordWeeklyInfo: RecordWeeklyInfo<BasicType.seiyuu>;
}

function weeklyContextReducer(state: WeeklyInfo, action: WeeklyAction): WeeklyInfo {
    switch (action.basicType) {
        case BasicType.character:
            return {
                ...state,
                [BasicType.character]: {
                    ...state.character,
                    [action.infoType]: action.recordWeeklyInfo,
                },
            };
        case BasicType.couple:
            return {
                ...state,
                [BasicType.couple]: {
                    ...state.couple,
                    [action.infoType]: action.recordWeeklyInfo,
                },
            };
        case BasicType.seiyuu:
            return {
                ...state,
                [BasicType.seiyuu]: {
                    ...state.seiyuu,
                    [action.infoType]: action.recordWeeklyInfo,
                },
            };

        default:
            return state;
    }
}

const WEEKLY_INFO_LIST = [
    {
        basicType: BasicType.character,
        infoTypeList: [
            CharacterRecordType.illust,
            CharacterRecordType.novel,
            AggregationType.illustWithNovel,
        ],
    },
    {
        basicType: BasicType.couple,
        infoTypeList: [
            CharacterRecordType.illust,
            CharacterRecordType.illustReverse,
            CharacterRecordType.illustIntersection,
            CharacterRecordType.novel,
            CharacterRecordType.novelReverse,
            CharacterRecordType.novelIntersection,
            AggregationType.coupleUnionIllust,
            AggregationType.coupleUnionNovel,
            AggregationType.illustWithNovel,
        ],
    },
    {
        basicType: BasicType.seiyuu,
        infoTypeList: [
            SeiyuuRecordType.twitterFollower,
        ],
    },
] as const;

const CHARA_WEEKLY_INFO_LIST = {
    basicType: BasicType.character,
    infoTypeList: [
        CharacterRecordType.illust,
        CharacterRecordType.novel,
        AggregationType.illustWithNovel,
    ],
} as const;

const COUPLE_WEEKLY_INFO_LIST = {
    basicType: BasicType.couple,
    infoTypeList: [
        CharacterRecordType.illust,
        CharacterRecordType.illustReverse,
        CharacterRecordType.illustIntersection,
        CharacterRecordType.novel,
        CharacterRecordType.novelReverse,
        CharacterRecordType.novelIntersection,
        AggregationType.coupleUnionIllust,
        AggregationType.coupleUnionNovel,
        AggregationType.illustWithNovel,
    ],
} as const;

const SEIYUU_WEEKLY_INFO_LIST = {
    basicType: BasicType.seiyuu,
    infoTypeList: [
        SeiyuuRecordType.twitterFollower,
    ],
} as const;

type WeeklyInfoList = typeof CHARA_WEEKLY_INFO_LIST | typeof COUPLE_WEEKLY_INFO_LIST;

// type WeeklyInfoList = {
//     basicType: BasicType,
//     infoTypeList: (CharacterRecordType | AggregationType | SeiyuuRecordType)[]
// };

// 将数据改造成类型关联，通过接口约束？但是我不能限制key的类型

const WEEKLY_INFO_RELATIVE_LIST = [
    {
        basicType: BasicType.character,
        infoTypeList: [
            CharacterRecordType.illust,
            CharacterRecordType.novel,
            AggregationType.illustWithNovel,
        ],
    },
    {
        basicType: BasicType.couple,
        infoTypeList: [
            CharacterRecordType.illust,
            CharacterRecordType.illustReverse,
            CharacterRecordType.illustIntersection,
            CharacterRecordType.novel,
            CharacterRecordType.novelReverse,
            CharacterRecordType.novelIntersection,
            AggregationType.coupleUnionIllust,
            AggregationType.coupleUnionNovel,
            AggregationType.illustWithNovel,
        ],
    },
    {
        basicType: BasicType.seiyuu,
        infoTypeList: [
            SeiyuuRecordType.twitterFollower,
        ],
    },
] as const;

type GetInfoTypeList<Type extends BasicType> = Type extends BasicType.character
    ? typeof WEEKLY_INFO_RELATIVE_LIST[0]['infoTypeList']
    : Type extends BasicType.couple
        ? typeof WEEKLY_INFO_RELATIVE_LIST[1]['infoTypeList']
        : Type extends BasicType.seiyuu
            ? typeof WEEKLY_INFO_RELATIVE_LIST[2]['infoTypeList']
            : never

const Weekly = () => {
    const [weeklyContext, dispatchWeeklyContext] = useReducer(weeklyContextReducer, initWeeklyContext);

    // // 获取 weeklyInfo
    // useEffect(() => {
    //     for (const { basicType, infoTypeList } of WEEKLY_INFO_LIST) {
    //         for (const infoType of infoTypeList) {
    //             reqRecordWeeklyInfoTest(basicType, infoType)
    //                 .then((recordWeeklyInfo) => {
    //                     dispatchWeeklyContext({
    //                         basicType,
    //                         infoType,
    //                         recordWeeklyInfo,
    //                     });
    //                     return true;
    //                 })
    //                 .catch((error) => console.log(error));
    //         }
    //     }
    // }, []);

    function getWeeklyInfo<Type extends BasicType>(basicType: Type, infoTypeList: GetInfoTypeList<Type>) {
        for (const infoType of infoTypeList) {
            reqRecordWeeklyInfoTest(basicType, infoType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        basicType,
                        infoType,
                        recordWeeklyInfo,
                    });
                    return true;
                })
                .catch((error) => console.log(error));
        }
    }

    // 获取 character weeklyInfo
    useEffect(() => {
        const { basicType, infoTypeList } = CHARA_WEEKLY_INFO_LIST;
        for (const infoType of infoTypeList) {
            reqRecordWeeklyInfoTest(basicType, infoType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        basicType: BasicType.character,
                        infoType,
                        recordWeeklyInfo,
                    });
                    return true;
                })
                .catch((error) => console.log(error));
        }
    }, []);

    // 获取 couple weeklyInfo
    useEffect(() => {
        const { basicType, infoTypeList } = COUPLE_WEEKLY_INFO_LIST;
        for (const infoType of infoTypeList) {
            reqRecordWeeklyInfoTest(basicType, infoType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        basicType: BasicType.couple,
                        infoType,
                        recordWeeklyInfo,
                    });
                    return true;
                })
                .catch((error) => console.log(error));
        }
    }, []);

    // 获取 seiyuu weeklyInfo
    useEffect(() => {
        const { basicType, infoTypeList } = SEIYUU_WEEKLY_INFO_LIST;
        for (const infoType of infoTypeList) {
            reqRecordWeeklyInfoTest(basicType, infoType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        basicType: BasicType.seiyuu,
                        infoType,
                        recordWeeklyInfo,
                    });
                    return true;
                })
                .catch((error) => console.log(error));
        }
    }, []);

    return (

        <WeeklyContext.Provider value = { weeklyContext }>
            <div className = 'weekly-wrap'>
                <CharaIllustIncreaseRank />
                <div className = 'compare-pie-container'>
                    <BasicProjectPie />
                    <CompareProjectPie />
                </div>
                <TwitterFollowerIncreaseRank />
                <BasicProjectPie />
                { /*
            <PixivIllustTotalRank />
            <CoupleCircle />

            <TwitterFollowerTotalRank />
             */ }
            </div>
        </WeeklyContext.Provider>
    );
};

export default Weekly;
