import React, { FC, useEffect, useRef } from 'react';
import {
    GRID_MARGIN_TOP,
    H1_FONT_SIZE,
    H2_FONT_SIZE,
    H3_FONT_SIZE,
    TITLE_MARGIN_TOP,
} from '@src/constant/echarts-toolbox';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { FavorRecordTypeList } from '@common/record';
import { PROJECT_AVERAGE_STR, PROJECT_MEDIAN_STR } from '@src/constant';
import { getSequentialPalette } from '@utils/color';

const favorTagList = ['50users入り', '100users入り', '500users入り', '1000users入り', '5000users入り', '10000users入り'];
interface StackBarProps {
    name: string;
    mainColor: string;
    stackValList: number[][];
}

const StackBar: FC<StackBarProps> = function ({ name, mainColor, stackValList }) {
    const stackBar = useRef(null);

    useEffect(() => {
        const len = FavorRecordTypeList.length;
        const seriesList = FavorRecordTypeList.map((type, i) => {
            let labelOption = {};

            switch (i) {
                case FavorRecordTypeList.length - 2:
                    labelOption = {
                        width: 10,
                        overflow: 'breakAll',
                        show: false,
                    };
                    break;
                case FavorRecordTypeList.length - 1:
                    labelOption = {
                        position: 'right',
                        formatter(param: any) {
                            const { seriesIndex, value } = param;
                            return `五千: ${value[seriesIndex]}\n一万: ${value[seriesIndex + 1]}`;
                        },
                    };
                    break;
                default:
                    break;
            }

            const palette = getSequentialPalette(mainColor, len);
            return {
                name: favorTagList[i],
                type: 'bar' as any,
                stack: 'total',
                itemStyle: {
                    color: palette[i],
                },
                label: {
                    show: true,
                    fontSize: H1_FONT_SIZE,
                    ...labelOption,
                },
            };
        });
        const option: EChartsOption = {
            title: {
                text: '2021年度 pixiv 新增同人图收藏量',
                left: 50,
                top: TITLE_MARGIN_TOP,
                textStyle: {
                    fontSize: H1_FONT_SIZE,
                },
            },
            legend: {
                orient: 'vertical',
                right: 50,
                top: TITLE_MARGIN_TOP,
                textStyle: {
                    fontSize: H3_FONT_SIZE,
                },
            },
            grid: {
                top: GRID_MARGIN_TOP,
                left: 150,
            },
            xAxis: {
                type: 'value',
                axisLabel: {
                    fontSize: H3_FONT_SIZE,
                },
                boundaryGap: ['0', '0.25'],
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    fontSize: H3_FONT_SIZE,
                },
            },
            animation: true,
            animationDuration: 300,
            dataset: {
                source: [
                    ['type', ...FavorRecordTypeList],
                    // [PROJECT_MEDIAN_STR, ...stackValList[2]],
                    [PROJECT_AVERAGE_STR, ...stackValList[1]],
                    [name, ...[...stackValList[0]].map((val) => (val > 0 ? val : 0))],
                ],
            },
            series: seriesList,
        };

        if (stackBar.current) {
            const chart = echarts.init(stackBar.current);
            chart.setOption(option);
        }
    }, [stackValList, name, mainColor]);

    return (
        <div
            ref = {stackBar}
            style = {{
                width: '100%',
                height: '100%',
            }}
        >
            stackBar
        </div>
    );
};

export default StackBar;
