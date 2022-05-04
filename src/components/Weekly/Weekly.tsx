import React, { useEffect, useReducer, useRef } from 'react';

import { Category } from '@common/root';
import { CharaRecordType, CoupleRecordType, SeiyuuRecordType } from '@common/record';
import { RecordTypeWeeklyInfo } from '@common/weekly';
import { reqRecordTypeWeekly, reqWeekIncrementRankOfTypeInRange } from '@src/api';
import { html2Image } from '@src/utils/html-to-image';

import { WeeklyContext, initWeeklyContext, WeeklyInfo } from './weekly-context-manager';

import CoupleCircle from './CoupleCircle/CoupleCircle';
import CharaPixivIllustWeekIncrementRank from './IncrementRank/CharaPixivIllust';
import TwitterFollowerIncrementRank from './IncrementRank/TwitterFollower';
import CharaPixivIllustTotalRank from './TotalRank/CharaPixivIllust';
import TwitterFollowerTotalRank from './TotalRank/TwitterFollower';
import CharaPixivIllustProjectPie from './ProjectPie/CharaPixivIllust';
import CompareProjectPie from './ProjectPie/CompareProjectPie';
import CharaPixivTagViewWeekIncrementRank from './IncrementRank/CharaPixivTagView';
import CharaPixivTagViewTotalRank from './TotalRank/CharaPixivTagView';

import './Weekly.less';
import CharaPixivNovelWeekIncrementRank from './IncrementRank/CharaPixivNovel';
import CharaPixivNovelTotalRank from './TotalRank/CharaPixivNovel';
import CharaPixivNovelProjectPie from './ProjectPie/CharaPixivNovel';
import CharaPixivTagViewProjectPie from './ProjectPie/CharaPixivTagView';

type WeeklyActionInfoMap = {
    [Category.chara]: {
        recordType: CharaRecordType;
        recordWeeklyInfo: RecordTypeWeeklyInfo;
    };
    [Category.couple]: {
        recordType: CoupleRecordType;
        recordWeeklyInfo: RecordTypeWeeklyInfo;
    };
    [Category.seiyuu]: {
        recordType: SeiyuuRecordType;
        recordWeeklyInfo: RecordTypeWeeklyInfo;
    };
}

type WeeklyActionInfo<T> = T extends keyof WeeklyActionInfoMap
    ? WeeklyActionInfoMap[T]
    : any;

type WeeklyAction = {
    [key in keyof typeof Category]: {
        category: typeof Category[key];
        payload: WeeklyActionInfo<typeof Category[key]>;
    };
}[keyof typeof Category];

function weeklyContextReducer(state: WeeklyInfo, action: WeeklyAction): WeeklyInfo {
    switch (action.category) {
        case Category.chara:
            return {
                ...state,
                [Category.chara]: {
                    ...state.chara,
                    [action.payload.recordType]: action.payload.recordWeeklyInfo,
                },
            };
        case Category.couple:
            return {
                ...state,
                [Category.couple]: {
                    ...state.couple,
                    [action.payload.recordType]: action.payload.recordWeeklyInfo,
                },
            };
        case Category.seiyuu:
            return {
                ...state,
                [Category.seiyuu]: {
                    ...state.seiyuu,
                    [action.payload.recordType]: action.payload.recordWeeklyInfo,
                },
            };

        default:
            return state;
    }
}

const CHARA_WEEKLY_INFO_LIST = {
    category: Category.chara,
    recordTypeList: [
        CharaRecordType.illust,
        CharaRecordType.novel,
        CharaRecordType.tagView,
        CharaRecordType.illustWithNovel,
    ],
} as const;

const COUPLE_WEEKLY_INFO_LIST = {
    category: Category.couple,
    recordTypeList: [
        CoupleRecordType.illust,
        CoupleRecordType.illustReverse,
        CoupleRecordType.illustIntersection,
        CoupleRecordType.novel,
        CoupleRecordType.novelReverse,
        CoupleRecordType.novelIntersection,
        CoupleRecordType.coupleUnionIllust,
        CoupleRecordType.coupleUnionNovel,
        CoupleRecordType.illustWithNovel,
    ],
} as const;

const SEIYUU_WEEKLY_INFO_LIST = {
    category: Category.seiyuu,
    recordTypeList: [
        SeiyuuRecordType.twitterFollower,
    ],
} as const;

const Weekly = () => {
    const [weeklyContext, dispatchWeeklyContext] = useReducer(weeklyContextReducer, initWeeklyContext);
    const weeklyWrap = useRef<HTMLDivElement>(null);

    // // TODO: 遍历获取 weeklyInfo

    // 获取 chara weeklyInfo
    useEffect(() => {
        const { category, recordTypeList } = CHARA_WEEKLY_INFO_LIST;
        for (const recordType of recordTypeList) {
            reqRecordTypeWeekly(category, recordType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        category: Category.chara,
                        payload: {
                            recordType,
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
        const { category, recordTypeList } = COUPLE_WEEKLY_INFO_LIST;
        for (const recordType of recordTypeList) {
            reqRecordTypeWeekly(category, recordType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        category: Category.couple,
                        payload: {
                            recordType,
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
        const { category, recordTypeList } = SEIYUU_WEEKLY_INFO_LIST;
        for (const recordType of recordTypeList) {
            reqRecordTypeWeekly(category, recordType)
                .then((recordWeeklyInfo) => {
                    dispatchWeeklyContext({
                        category: Category.seiyuu,
                        payload: {
                            recordType,
                            recordWeeklyInfo,
                        },
                    });
                    return true;
                })
                .catch((error) => console.log(error));
        }
    }, []);

    // 获取历史周增信息，方便整理周榜
    useEffect(() => {
        async function getHistoricalIncrementRank() {
            const [illust] = await Promise.all([
                reqWeekIncrementRankOfTypeInRange(Category.chara, CharaRecordType.illust),
            ]);
            console.log('illust historicalIncrementRank:', illust);
        }
        getHistoricalIncrementRank();
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
        <WeeklyContext.Provider value = {weeklyContext}>
            <div className = 'weekly-wrap' ref = {weeklyWrap}>
                <button type = 'button' onClick = {downloadAll}> 下载所有图片 </button>
                <CharaPixivIllustWeekIncrementRank />
                <div className = 'compare-pie-container'>
                    <CharaPixivIllustProjectPie />
                    {/* <CompareProjectPie /> */}
                </div>
                <CharaPixivIllustTotalRank />
                <CoupleCircle />
                <TwitterFollowerIncrementRank />
                <TwitterFollowerTotalRank />

                <CharaPixivNovelWeekIncrementRank />
                <CharaPixivNovelProjectPie />
                <CharaPixivNovelTotalRank />

                <CharaPixivTagViewWeekIncrementRank />
                <CharaPixivTagViewProjectPie />
                <CharaPixivTagViewTotalRank />
            </div>
        </WeeklyContext.Provider>
    );
};

export default Weekly;
