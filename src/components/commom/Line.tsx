import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Category, ProjectName } from '@common/root';
import { reqProjectMemberListOfCategory, reqWeekIncrementOfProjectInRange } from '@src/api';
import { charaRichMap, KeyofRomaColorMap, PROJECT_AVERAGE_STR, PROJECT_MEDIAN_STR, romaColorMap } from '@src/constant';
import { CharaRecordType, PersonRecordType } from '@common/record';

import * as echarts from 'echarts';
import {
    GRID_MARGIN_TOP,
    H1_FONT_SIZE,
    H2_FONT_SIZE,
    H3_FONT_SIZE,
    H4_FONT_SIZE,
    TITLE_MARGIN_TOP,
} from '@src/constant/echarts-toolbox';
import { getWeeklyFetchDate, isFetchDate } from '@common/weekly';
import { CharaInfo, PersonInfo } from '@common/member-info';
import { getComplementaryColor, getForegroundColorByBackground } from '@utils/color';
import { formatDate } from '@utils/date';

interface ProjectMemberLineProps {
    /**
     * 需要展示的 index，0 为企划平均，从 1 开始是企划的各个成员
     */
    activeRomaName: string;
    mainColor: string;
}
const ProjectMemberLine: FC<ProjectMemberLineProps> = function ({ activeRomaName, mainColor }) {
    const lineRace = useRef(null);
    useEffect(() => {
        async function getRecordOfTypeInRange() {
            // FIXME: 每次 rerender 都会重新 req
            const recordList = await reqWeekIncrementOfProjectInRange(
                Category.chara,
                CharaRecordType.illust,
                ProjectName.llss,
                '2020-12-25',
                '2021-12-31',
            );

            const memberCategory = await reqProjectMemberListOfCategory({
                projectName: ProjectName.llss,
                category: Category.chara,
            });
            const activeIndex = memberCategory.findIndex(((charaInfo) => charaInfo.romaName === activeRomaName));
            // 处理企划平均值的 category info
            memberCategory.unshift({
                name: PROJECT_AVERAGE_STR,
            } as CharaInfo);

            // 1. 返回的数据日期间隔不一定是一周，只取 fetchDate 的数据即可
            // 2. records 数组直接展开即可，通过 echarts 的数据映射处理数据
            // 3. 如果是映射的数据，比如填充0，否则会出现无法映射的情况
            const sourceData = [];
            const fetchDateList: string[] = [];
            for (const { date, average, median, records } of recordList) {
                if (isFetchDate(date)) {
                    const lengthDiff = memberCategory.length - 1 - records.length;
                    const appendZero = Array.from({ length: lengthDiff }).fill(0);
                    sourceData.push([date, average, ...records, ...appendZero] as const);
                    fetchDateList.push(date);
                }
            }

            const seriesList: echarts.SeriesOption[] = [];

            // 最大值的 symbol 实在是不好处理，只能单独抽出来
            const overflowMaxSymbol = {
                type: 'max' as any,
                name: 'Max',
                symbolRotate: 180,
                y: 100,
                label: {
                    position: 'top',
                    distance: -35,
                    color: getForegroundColorByBackground(mainColor),
                    textBorderColor: '#000',
                },
            };
            const normalMaxSymbol = { type: 'max' as any, name: 'Max' };

            const mainColorMinSymbol = {
                type: 'min',
                name: 'Min',
                symbolRotate: 180,
                label: {
                    position: 'top',
                    distance: -35,
                    color: getForegroundColorByBackground(mainColor),
                    textBorderColor: '#000',
                },
            };

            const restColorMinSymbol = {
                type: 'min',
                name: 'Min',
                symbolRotate: 180,
                label: {
                    position: 'top',
                    distance: -35,
                    color: getForegroundColorByBackground(getComplementaryColor(mainColor)),
                    textBorderColor: '#000',
                },
            };

            // 给每个成员生成一个折线 series
            for (const [i, { name, supportColor, birthday }] of memberCategory.entries()) {
                let series: echarts.SeriesOption = {
                    animation: true,
                    animationDuration: 5000,
                    animationDelay: 3500,
                    type: 'line',
                    name: `${name}`,
                    // 第一列是 x 轴，第二列是 average， 第 index + 1 列是单个成员的 y 轴
                    encode: { x: 0, y: i + 1 },
                    itemStyle: {
                        color: supportColor || getComplementaryColor(mainColor),
                    },
                    lineStyle: {
                        width: 5,
                    },
                    clip: true,
                    showSymbol: true,
                    symbolSize: 10,
                    symbol: 'emptyCircle',
                    markPoint: {
                        symbol: 'pin',
                        label: {
                            fontSize: H4_FONT_SIZE,
                        },
                        data: [
                            name === PROJECT_AVERAGE_STR ? normalMaxSymbol : overflowMaxSymbol,
                            // name === PROJECT_AVERAGE_STR ? normalMaxSymbol : normalMaxSymbol,
                            name === PROJECT_AVERAGE_STR ? restColorMinSymbol : mainColorMinSymbol,

                        ],
                        animation: true,
                    },
                };

                // 计算 markLineIndex
                let markLineIndex;
                if (birthday) {
                    const [month, date] = birthday.split('-');
                    const birthDate = new Date(2021, Number.parseInt(month, 10) - 1, Number.parseInt(date, 10) + 1);
                    const birthFetchDate = getWeeklyFetchDate(formatDate(birthDate));
                    markLineIndex = fetchDateList.indexOf(birthFetchDate);

                    series = {
                        ...series,
                        markLine: {
                            symbol: ['none', 'none'],
                            label: {
                                show: true,
                                formatter(param: any) {
                                    const textArray = [
                                        '生日',
                                    ];
                                    return textArray[param.dataIndex];
                                },
                                fontSize: H3_FONT_SIZE,
                            },
                            data: [{
                                name: '1',
                                xAxis: markLineIndex,
                            }],
                            animation: false,
                        },
                    };
                }

                seriesList.push(series);
            }

            const option = {
                dataset: {
                    source: sourceData,
                },
                title: {
                    text: '2021年度 pixiv 同人图周增量走势',
                    top: TITLE_MARGIN_TOP,
                    textStyle: {
                        fontSize: H1_FONT_SIZE,
                    },
                },
                grid: {
                    top: GRID_MARGIN_TOP,
                    left: 50,
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
                    max: 210,
                    min: -30,
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
                series: [seriesList[0], seriesList[activeIndex]],
            };

            if (lineRace.current) {
                const chart = echarts.init(lineRace.current);
                chart.setOption(option);
            }
        }
        getRecordOfTypeInRange();
    }, [activeRomaName, mainColor]);

    return (
        <div
            ref = {lineRace}
            style = {{
                width: '100%',
                height: '100%',
            }}
        >
            lineRace
        </div>
    );
};

export default ProjectMemberLine;
