import React, { useEffect, useReducer, useRef } from 'react';

import { AggregationType, BasicType, CharacterRecordType, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import {
    RecordWeeklyInfo,
    WeeklyInfo,
} from '@chiyu-bit/canon.root/weekly';
import { reqInfoTypeWeekly } from '@src/api';
import { html2Image } from '@src/utils/html-to-image';
import { WeeklyContext, initWeeklyContext } from './weekly-context-manager';

import CoupleCircle from './CoupleCircle';
import CharaPixivIllustWeekIncrementRank from './IncrementRank/CharaPixivIllust';
import TwitterFollowerIncrementRank from './IncrementRank/TwitterFollower';
import CharaPixivIllustTotalRank from './TotalRank/CharaPixivIllust';
import TwitterFollowerTotalRank from './TotalRank/TwitterFollower';
import BasicProjectPie from './ProjectPie/BasicProjectPie';
import CompareProjectPie from './ProjectPie/CompareProjectPie';

import './Weekly.less';
import CharaPixivTagViewWeekIncrementRank from './IncrementRank/CharaPixivTagView';
import CharaPixivTagViewTotalRank from './TotalRank/CharaPixivTagView';

type WeeklyActionInfoMap = {
    [BasicType.character]: {
        infoType: CharacterRecordType | AggregationType;
        recordWeeklyInfo: RecordWeeklyInfo<BasicType.character>;
    };
    [BasicType.couple]: {
        infoType: CharacterRecordType | AggregationType;
        recordWeeklyInfo: RecordWeeklyInfo<BasicType.couple>;
    };
    [BasicType.seiyuu]: {
        infoType: SeiyuuRecordType;
        recordWeeklyInfo: RecordWeeklyInfo<BasicType.seiyuu>;
    };
}

type WeeklyActionInfo<T> = T extends keyof WeeklyActionInfoMap
    ? WeeklyActionInfoMap[T]
    : any;

type WeeklyAction = {
    [key in keyof typeof BasicType]: {
        basicType: typeof BasicType[key];
        payload: WeeklyActionInfo<typeof BasicType[key]>;
    };
}[keyof typeof BasicType];

function weeklyContextReducer(state: WeeklyInfo, action: WeeklyAction): WeeklyInfo {
    switch (action.basicType) {
        case BasicType.character:
            return {
                ...state,
                [BasicType.character]: {
                    ...state.character,
                    [action.payload.infoType]: action.payload.recordWeeklyInfo,
                },
            };
        case BasicType.couple:
            return {
                ...state,
                [BasicType.couple]: {
                    ...state.couple,
                    [action.payload.infoType]: action.payload.recordWeeklyInfo,
                },
            };
        case BasicType.seiyuu:
            return {
                ...state,
                [BasicType.seiyuu]: {
                    ...state.seiyuu,
                    [action.payload.infoType]: action.payload.recordWeeklyInfo,
                },
            };

        default:
            return state;
    }
}

const CHARA_WEEKLY_INFO_LIST = {
    basicType: BasicType.character,
    infoTypeList: [
        CharacterRecordType.illust,
        CharacterRecordType.novel,
        CharacterRecordType.tagView,
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

const Weekly = () => {
    const [weeklyContext, dispatchWeeklyContext] = useReducer(weeklyContextReducer, initWeeklyContext);
    const weeklyWrap = useRef<HTMLDivElement>(null);

    // // TODO: 遍历获取 weeklyInfo

    // 获取 character weeklyInfo
    useEffect(() => {
        const { basicType, infoTypeList } = CHARA_WEEKLY_INFO_LIST;
        for (const infoType of infoTypeList) {
            reqInfoTypeWeekly(basicType, infoType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        basicType: BasicType.character,
                        payload: {
                            infoType,
                            recordWeeklyInfo,
                        },
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
            reqInfoTypeWeekly(basicType, infoType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        basicType: BasicType.couple,
                        payload: {
                            infoType,
                            recordWeeklyInfo,
                        },
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
            reqInfoTypeWeekly(basicType, infoType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        basicType: BasicType.seiyuu,
                        payload: {
                            infoType,
                            recordWeeklyInfo,
                        },
                    });
                    return true;
                })
                .catch((error) => console.log(error));
        }
    }, []);

    async function downloadAll() {
        if (weeklyWrap.current) {
            const chartNodes = weeklyWrap.current.children;
            // 跳过第一个下载 button
            for (let i = 1; i < chartNodes.length; i++) {
                const childNode = chartNodes[i];
                // eslint-disable-next-line no-await-in-loop
                await html2Image(childNode as HTMLElement, `0${i}-${childNode.id}`);
            }
        }
    }

    return (
        <WeeklyContext.Provider value = { weeklyContext }>
            <div className = 'weekly-wrap' ref = { weeklyWrap }>
                <button type = 'button' onClick = { downloadAll }> 下载所有图片 </button>
                <CharaPixivIllustWeekIncrementRank />
                <div className = 'compare-pie-container'>
                    <BasicProjectPie />
                    { /* <CompareProjectPie /> */ }
                </div>
                <CharaPixivIllustTotalRank />
                <CharaPixivTagViewWeekIncrementRank />
                <CoupleCircle />
                { /* <PixivTagViewTotalRank /> */ }
                <TwitterFollowerIncrementRank />
                <TwitterFollowerTotalRank />
                { /* <BasicProjectPie /> */ }
            </div>
        </WeeklyContext.Provider>
    );
};

export default Weekly;
