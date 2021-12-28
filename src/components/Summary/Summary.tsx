import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BasicType, ProjectName, SeiyuuRecordType } from '@chiyu-bit/canon.root';
import { reqMemberList, reqRelativeIncrementOfTypeInRange } from '@src/api';

import * as echarts from 'echarts';
import { characterRichMap, KeyofRomaColorMap, romaColorMap } from '@src/constant';
import TwitterFollowerBarRace from './BarRace/TwitterFollower';
import GroupedBar from './GroupedBar/GroupedBar';

const Summary = () => {
    const lineRace = useRef(null);
    useEffect(() => {
        async function getRecordOfTypeInRange() {
            const seiyuuRecord = await reqRelativeIncrementOfTypeInRange(
                BasicType.seiyuu,
                SeiyuuRecordType.twitterFollower,
                ProjectName.llss,
                '2020-12-18',
                '2021-12-14',
            );

            const liellaMemberList = await reqMemberList({
                projectName: ProjectName.llss,
                basicType: BasicType.seiyuu,
            });

            let lastDateTime = new Date(seiyuuRecord[0].date);
            lastDateTime.setDate(lastDateTime.getDate() - 7);
            const seiyuuRecordData = [];

            for (const { date, records } of seiyuuRecord) {
                const originTime = new Date(date);
                const dateTime = new Date(date);
                dateTime.setDate(dateTime.getDate() - 7);
                if (dateTime.getTime() === lastDateTime.getTime()) {
                    lastDateTime = originTime;
                    seiyuuRecordData.push([date, ...records] as const);
                }
            }

            const seiyuuList = liellaMemberList.map(({ name, romaName }) => `${name}-${romaName}`);

            const source = [
                [
                    'date',
                    '伊達さゆり-sayurin',
                    'Liyuu-liyuu',
                    '岬なこ-nako',
                    'ペイトン尚未-payton',
                    '青山なぎさ-nagisa',
                ],
                ...seiyuuRecordData,
            ];

            const seriesList: echarts.SeriesOption[] = [];
            echarts.util.each(seiyuuList, (nameAndRoma) => {
                const [member, romaName] = nameAndRoma.split('-');
                seriesList.push({
                    type: 'line',
                    showSymbol: false,
                    name: nameAndRoma,
                    endLabel: {
                        show: true,
                        formatter(params: any) {
                            return `{${romaName}|${member}: ${params.value[params.seriesIndex + 1]}}`;
                        },
                        rich: {
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2,
                            },
                            ...characterRichMap,
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
            });

            const option = {
                animationDuration: 15_000,
                dataset: {
                    source: seiyuuRecordData,
                },
                title: {
                    text: 'Liella 成员推特关注数增量 since 2020-12-14',
                    left: 'left',
                    top: 20,
                    textStyle: {
                        fontSize: 32,
                    },
                },
                grid: {
                    top: 100,
                    right: 140,
                },
                tooltip: {
                    order: 'valueDesc',
                    trigger: 'axis',
                    position: ['50%', '50%'],
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
            { /* <GroupedBar /> */ }
            { /* <TwitterFollowerBarRace /> */ }
            <div
                ref = { lineRace }
                style = { {
                    width: '100vw',
                    height: '100vh',
                } }
            >
                lineRace
            </div>
        </div>
    );
};

export default Summary;
