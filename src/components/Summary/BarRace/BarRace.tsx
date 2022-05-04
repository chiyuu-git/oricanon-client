/**
 * BarRace 本质上只是多个 bar 的渐变展示，echarts 内置了排名变化的渐变效果
 * 接受的数据应该与 bar 组件保持一致, 数据维度是单一的，只有声优及对应的record
 * date 维度不在 bar 内部维护
 */

import React, { FC, useEffect, useRef } from 'react';

import * as echarts from 'echarts';
import { charaRichMap, KeyofRomaColorMap, romaColorMap } from '@src/constant';
import { shadeRGBColor } from '@src/utils/color';
import { GRID_MARGIN_TOP, H1_FONT_SIZE, TITLE_MARGIN_TOP } from '@src/constant/echarts-toolbox';
import { EChartsOption, EChartsType } from 'echarts';
import { RecordList } from './common';

interface BarRaceProps {
    category: string[];
    recordList: RecordList;
    curIndex: number;
    dataUpdateInterval: number;
}

// 排序动画持续时间
const SORT_DURATION = 300;

const BarRace: FC<BarRaceProps> = ({ category, recordList, curIndex, dataUpdateInterval }) => {
    const barRaceEl = useRef(null);
    const barRaceChart = useRef<EChartsType | null>(null);
    const initData = recordList[0];

    // init base option
    useEffect(() => {
        if (!barRaceEl.current) {
            return;
        }

        barRaceChart.current = echarts.init(barRaceEl.current);

        const chartOption: EChartsOption = {
            title: {
                text: 'Liella 成员推特关注数增量 since 2020-12-14',
                left: 'left',
                top: TITLE_MARGIN_TOP,
                textStyle: {
                    fontSize: H1_FONT_SIZE,
                },
            },
            grid: {
                top: GRID_MARGIN_TOP,
                containLabel: true,
            },
            xAxis: {
                // 表示用数据的最大值作为 X 轴最大值，视觉效果更好
                max: 'dataMax',
                axisLine: {
                    show: true,
                },
            },
            yAxis: {
                type: 'category',
                data: category,
                // 表示 Y 轴从下往上是从小到大的排列
                inverse: true,
                // 表示第一次柱条排序动画的时长
                animationDuration: SORT_DURATION,
                // 表示第一次后柱条排序动画的时长
                animationDurationUpdate: SORT_DURATION,
                // only the largest n-1 bars will be displayed
                max: category.length - 1,
                axisLabel: {
                    margin: 14,
                    formatter(nameAndRoma: string) {
                        const [name, romaName] = nameAndRoma.split('-');

                        if (name && romaName) {
                            // 试了几个 key 使用 romaName 作为 key 可行
                            return `{${romaName}|${name}}`;
                        }
                        return '';
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
            },
            series: [
                {
                    // 表示开启 Y 轴的动态排序效果
                    realtimeSort: true,
                    type: 'bar',
                    data: initData,
                    label: {
                        show: true,
                        position: 'right',
                        // 实时改变标签
                        valueAnimation: true,
                    },
                    itemStyle: {
                        color(params: any) {
                            const [name, romaName] = params.name.split('-');
                            const col = romaColorMap[romaName as KeyofRomaColorMap];

                            return {
                                type: 'linear',
                                x: 1,
                                y: 0,
                                x2: 0,
                                y2: 0,
                                colorStops: [
                                    { offset: 0, color: col },
                                    { offset: 0.6, color: col },
                                    { offset: 1, color: shadeRGBColor(col, 60) },
                                ],
                            };
                        },
                    },
                },
            ],
            legend: {
                show: true,
            },
            // 表示第一份数据不需要从 0 开始动画（如果希望从 0 开始则设为和 animationDurationUpdate 相同的值）
            animationDuration: 0,
            // 示每次更新动画时长，这一数值应与调用 setOption 改变数据的频率相同
            animationDurationUpdate: dataUpdateInterval,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear',
            options: [],
        };

        // 图表的初始配置
        barRaceChart.current.setOption(chartOption);
    }, [category, initData, dataUpdateInterval]);

    // update switchable option

    useEffect(() => {
        if (!barRaceChart.current) {
            return;
        }
        const record = recordList[curIndex];

        barRaceChart.current.setOption({
            series: [
                {
                    type: 'bar',
                    data: record,
                },
            ],
        });
    }, [recordList, curIndex]);

    return (
        <div
            ref = {barRaceEl}
            style = {{
                width: '65vw',
                height: '100vh',
            }}
        />
    );
};
export default BarRace;
