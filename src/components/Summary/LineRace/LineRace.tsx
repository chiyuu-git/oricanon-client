import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Category, ProjectName } from '@common/root';
import { reqMemberList, reqRelativeIncrementOfTypeInRange, reqWeekIncrementOfProjectInRange } from '@src/api';
import { charaRichMap, KeyofRomaColorMap, romaColorMap } from '@src/constant';
import { CharaRecordType, SeiyuuRecordType } from '@common/record';

import * as echarts from 'echarts';
import { GRID_MARGIN_TOP, TITLE_FONT_SIZE, TITLE_MARGIN_TOP } from '@src/constant/echarts-toolbox';

const LineRace = () => {
    const lineRace = useRef(null);
    useEffect(() => {
        async function getRecordOfTypeInRange() {
            // const seiyuuRecord = await reqRelativeIncrementOfTypeInRange(
            //     Category.seiyuu,
            //     SeiyuuRecordType.twitterFollower,
            //     ProjectName.llss,
            //     '2020-12-25',
            //     '2021-12-14',
            // );

            const charaRecord = await reqWeekIncrementOfProjectInRange(
                Category.seiyuu,
                SeiyuuRecordType.twitterFollower,
                ProjectName.lln,
                '2021-01-01',
                '2021-12-31',
            );

            console.log('charaRecord:', charaRecord);
            // const liellaMemberList = await reqMemberList({
            //     projectName: ProjectName.llss,
            //     category: Category.seiyuu,
            // });

            const nijigakuMemberList = await reqMemberList({
                projectName: ProjectName.lln,
                category: Category.seiyuu,
            });

            // 1. 返回的数据日期间隔不一定是一周
            // 2. 整理数据成 echarts 的 dataset 形式
            let lastWeeklyFetchDate = new Date(charaRecord[0].date);
            lastWeeklyFetchDate.setDate(lastWeeklyFetchDate.getDate() - 7);
            const sourceData = [];

            for (const { date, records } of charaRecord) {
                const originTime = new Date(date);
                const lastWeeklyDate = new Date(date);
                lastWeeklyDate.setDate(lastWeeklyDate.getDate() - 7);
                // 七天前的日期与上一个 fetchDate 相同，说明今天是 fetchDate
                if (lastWeeklyDate.getTime() === lastWeeklyFetchDate.getTime()) {
                    lastWeeklyFetchDate = originTime;
                    sourceData.push([date, ...records] as const);
                }
            }

            const seriesList: echarts.SeriesOption[] = [];
            // 给每个成员生成一个折线 series
            for (const { name, romaName } of nijigakuMemberList) {
                seriesList.push({
                    type: 'line',
                    showSymbol: false,
                    name: `${name}-${romaName}`,
                    endLabel: {
                        show: true,
                        formatter(params: any) {
                            return `{${romaName}|${name}: ${params.value[params.seriesIndex + 1]}}`;
                        },
                        rich: {
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2,
                            },
                            ...charaRichMap,
                        },
                    },
                    lineStyle: {
                        color: romaColorMap[romaName as KeyofRomaColorMap],
                    },
                    label: {
                        valueAnimation: true,
                    },
                    labelLayout: {
                        moveOverlap: 'shiftY',
                    },
                    markLine: {
                        symbol: ['none', 'none'],
                        label: {
                            show: true,
                            formatter(param) {
                                const textArray = [
                                    '首次生放送',
                                    '动画一期开播',
                                    '1st live tour',
                                ];
                                return textArray[param.dataIndex];
                            },
                            fontSize: 16,
                        },
                        data: [{
                            name: '1',
                            xAxis: 6,
                        }, {
                            name: '2',
                            xAxis: 29,
                        }, {
                            name: '3',
                            xAxis: 45,
                        }],
                        animation: false,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                });
            }

            const option = {
                animationDuration: 300,
                dataset: {
                    source: sourceData,
                },
                title: {
                    text: 'Liella 成员推特关注数增量 since 2020-12-14',
                    left: 'left',
                    top: TITLE_MARGIN_TOP,
                    textStyle: {
                        fontSize: TITLE_FONT_SIZE,
                    },
                },
                grid: {
                    top: GRID_MARGIN_TOP,
                },
                tooltip: {
                    order: 'valueDesc',
                    trigger: 'axis',
                    // position: ['50%', '50%'],
                },
                xAxis: {
                    type: 'category',
                    nameLocation: 'middle',
                },
                yAxis: {
                    axisLine: {
                        show: true,
                    },
                },
                series: seriesList,
            };

            if (lineRace.current) {
                const chart = echarts.init(lineRace.current);
                chart.setOption(option);
            }
        }
        getRecordOfTypeInRange();
    }, []);

    return (
        <div>
            <div
                ref = {lineRace}
                style = {{
                    width: '100vw',
                    height: '100vh',
                }}
            >
                lineRace
            </div>
        </div>
    );
};

export default LineRace;
