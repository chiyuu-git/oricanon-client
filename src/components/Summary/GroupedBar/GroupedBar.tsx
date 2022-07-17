import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { GRID_MARGIN_TOP, H1_FONT_SIZE, H3_FONT_SIZE, TITLE_MARGIN_TOP } from '@src/constant/echarts-toolbox';
import { shadeRGBColor } from '@src/utils/color';

function GroupedBar() {
    const bar = useRef(null);
    useEffect(() => {
        const seriesList = Array.from({ length: 5 }).map(() => ({
            type: 'bar',
            label: {
                show: true,
                position: 'top',
            },
            itemStyle: {
                color(params: any) {
                    return {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: params.color },
                            { offset: 0.6, color: params.color },
                            { offset: 1, color: shadeRGBColor(params.color, 50) },
                        ],
                    };
                },
            },
        }));
        const option = {
            title: {
                text: 'Liella 成员关注数增量 区间分组',
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
            legend: {
                top: 50,
            },
            tooltip: {},
            dataset: {
                source: [
                    ['range', '伊達さゆり', 'Liyuu', '岬なこ', 'ペイトン尚未', '青山なぎさ'],
                    ['声优公布-首次生放送前', 23_866, 31_698, 22_567, 24_518, 23_515],
                    ['首次生放送-动画开播前', 26_368, 14_258, 19_920, 20_368, 25_900],
                    ['动画期间', 35_436, 39_382, 27_563, 26_142, 30_857],
                    ['live期间', 14_535, 17_858, 11_986, 11_457, 15_028],
                ],
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    fontSize: H3_FONT_SIZE,
                },
            },
            yAxis: {},
            // 全局调色盘默认就有映射性质
            color: ['#ff7f27', '#a0fff9', '#ff6e90', '#74f466', '#0000a0'],
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: seriesList,
        };

        if (bar.current) {
            const chart = echarts.init(bar.current);
            chart.setOption(option);
        }
    });
    return (
        <div
            ref = {bar}
            style = {{
                width: '100vw',
                height: '100vh',
            }}
        >
            GroupedBar
        </div>
    );
}

export default GroupedBar;
