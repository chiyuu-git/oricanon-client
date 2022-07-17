import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Category, ProjectName } from '@common/root';
import { reqProjectMemberListOfCategory, reqWeekIncrementOfProjectInRange } from '@src/api';
import { charaRichMap, KeyofRomaColorMap, PROJECT_AVERAGE_STR, romaColorMap } from '@src/constant';
import { CharaRecordType, CoupleRecordType, PersonRecordType } from '@common/record';

import * as echarts from 'echarts';
import {
    GRID_MARGIN_TOP,
    H1_FONT_SIZE,
    H2_FONT_SIZE,
    H3_FONT_SIZE,
    TITLE_MARGIN_TOP,
} from '@src/constant/echarts-toolbox';
import { isFetchDate } from '@common/weekly';
import { CharaInfo, CoupleInfo, PersonInfo } from '@common/member-info';

function LineRace() {
    const lineRace = useRef(null);
    useEffect(() => {
        async function getRecordOfTypeInRange() {
            const recordList = await reqWeekIncrementOfProjectInRange(
                Category.couple,
                CoupleRecordType.illust,
                ProjectName.llss,
                '2021-01-01',
                '2021-12-31',
            );
            console.log('recordList:', recordList);

            const memberCategory = await reqProjectMemberListOfCategory({
                projectName: ProjectName.llss,
                category: Category.couple,
            });
            // 处理企划平均值的 category info
            memberCategory.unshift({
                name: PROJECT_AVERAGE_STR,
            } as CoupleInfo);

            // 1. 返回的数据日期间隔不一定是一周，只取 fetchDate 的数据即可
            // 2. records 数组直接展开即可，通过 echarts 的数据映射处理数据
            const sourceData = [];
            for (const { date, average, records } of recordList) {
                if (isFetchDate(date)) {
                    sourceData.push([date, average, ...records] as const);
                }
            }

            const seriesList: echarts.SeriesOption[] = [];

            // 给每个成员生成一个折线 series
            for (const [i, { name, romaName }] of memberCategory.entries()) {
                seriesList.push({
                    type: 'line',
                    name: `${name}`,
                    // 第一列是 x 轴，第二列是 average， 第 index + 1 列是单个成员的 y 轴
                    encode: { x: 0, y: i + 1 },
                    itemStyle: {
                        // color: romaColorMap[romaName as KeyofRomaColorMap] || 'orange',
                    },
                    lineStyle: {
                        type: name === PROJECT_AVERAGE_STR ? 'dotted' : 'solid',
                        width: 5,
                    },
                    showSymbol: false,
                    clip: true,
                    // label: {
                    //     show: true,
                    //     position: 'top',
                    //     formatter(params: any) {
                    //         const val = params.value[i + 1];
                    //         // 只显示大于企划平均值的
                    //         return val >= 40 ? val : '';
                    //     },
                    // },
                    // endLabel: {
                    //     show: true,
                    //     formatter(params: any) {
                    //         return `{${romaName}|${name}: ${params.value[params.seriesIndex + 1]}}`;
                    //     },
                    //     rich: {
                    //         per: {
                    //             color: '#eee',
                    //             backgroundColor: '#334455',
                    //             padding: [2, 4],
                    //             borderRadius: 2,
                    //         },
                    //         ...charaRichMap,
                    //     },
                    // },
                    // label: {
                    //     valueAnimation: true,
                    // },
                    // labelLayout: {
                    //     moveOverlap: 'shiftY',
                    // },
                    // emphasis: {
                    //     focus: 'series',
                    // },
                    // markLine: {
                    //     symbol: ['none', 'none'],
                    //     label: {
                    //         show: true,
                    //         formatter(param) {
                    //             const textArray = [
                    //                 '首次生放送',
                    //                 '动画一期开播',
                    //                 '1st live tour',
                    //             ];
                    //             return textArray[param.dataIndex];
                    //         },
                    //         fontSize: H3_FONT_SIZE,
                    //     },
                    //     data: [{
                    //         name: '1',
                    //         xAxis: 6,
                    //     }, {
                    //         name: '2',
                    //         xAxis: 29,
                    //     }, {
                    //         name: '3',
                    //         xAxis: 45,
                    //     }],
                    //     animation: false,
                    // },
                });
            }

            const option = {
                animationDuration: 300,
                dataset: {
                    source: sourceData,
                },
                title: {
                    text: 'pixiv-illust-周增量走势图',
                    left: 50,
                    top: TITLE_MARGIN_TOP,
                    textStyle: {
                        fontSize: H1_FONT_SIZE,
                    },
                },
                grid: {
                    top: GRID_MARGIN_TOP,
                },
                tooltip: {
                    order: 'valueDesc',
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    nameLocation: 'middle',
                    axisLabel: {
                        fontSize: H3_FONT_SIZE,
                    },
                },
                yAxis: {
                    max: 150,
                    axisLine: {
                        show: true,
                    },
                    axisLabel: {
                        fontSize: H3_FONT_SIZE,
                    },
                },
                legend: {
                    top: TITLE_MARGIN_TOP,
                    right: 100,
                    orient: 'vertical',
                    itemWidth: 50,
                    itemHeight: 28,
                    textStyle: {
                        fontSize: H2_FONT_SIZE,
                    },
                },
                series: [seriesList[0], ...seriesList],
            };

            if (lineRace.current) {
                const chart = echarts.init(lineRace.current);
                chart.setOption(option);
            }
        }
        getRecordOfTypeInRange();
    }, []);

    return (
        <div
            ref = {lineRace}
            style = {{
                width: '100vw',
                height: '100vh',
            }}
        >
            lineRace
        </div>
    );
}

export default LineRace;
