import { CharaMemberIncrementInfo, DIMENSION_LIST } from '@common/summary';
import { PROJECT_AVERAGE_STR } from '@src/constant';
import { H1_FONT_SIZE, H2_FONT_SIZE, H3_FONT_SIZE, TITLE_MARGIN_TOP } from '@src/constant/echarts-toolbox';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import React, { FC, useEffect, useRef, useState } from 'react';

const indicatorTextList = ['illust', 'r18\nRate', 'favorRate', 'novel', 'tag\nView'];

interface RadarProps {
    rankList: CharaMemberIncrementInfo[][];
    memberInfo: CharaMemberIncrementInfo ;
    mainColor: string;
    supColor: string;
}

const Radar: FC<RadarProps> = function ({
    rankList,
    memberInfo,
    mainColor,
    supColor,
}) {
    const graph = useRef(null);
    const radarChart = useRef<EChartsType | null>(null);

    useEffect(() => {
        const indicatorList = DIMENSION_LIST.map((recordType, i) => ({
            text: indicatorTextList[i],
            max: rankList[i][0][recordType],
            color: 'black',
            overflow: 'breakAll',
        }));
        const average = DIMENSION_LIST.map((recordType, i) => {
            const sum = rankList[i].reduce((acc, info) => acc + info[recordType], 0);
            return sum / (rankList[i].length - 1);
        });

        const memberData = DIMENSION_LIST.map((recordType, i) => memberInfo[recordType]);

        const option: echarts.EChartsOption = {
            legend: {
                left: 'left',
                top: 10,
                data: [
                    PROJECT_AVERAGE_STR,
                    '成员',
                ],
                orient: 'vertical',
                textStyle: {
                    fontSize: H3_FONT_SIZE,
                },
            },
            radar: {
                indicator: indicatorList,
                radius: '70%',
                center: ['50%', '50%'],
                axisName: {
                    fontSize: H3_FONT_SIZE,
                },
            },
            series: [{
                type: 'radar',
                tooltip: {
                    trigger: 'item',
                },
                data: [
                    {
                        value: average,
                        name: PROJECT_AVERAGE_STR,
                        itemStyle: {
                            color: supColor,
                        },
                        lineStyle: {
                            color: supColor,
                        },
                        areaStyle: {
                            color: supColor,
                        },
                    },
                    {
                        value: memberData,
                        name: '成员',
                        itemStyle: {
                            color: mainColor,
                        },
                        lineStyle: {
                            color: mainColor,
                        },
                        areaStyle: {
                            color: mainColor,
                        },
                    },
                ],
            }],
        };

        if (graph.current) {
            if (!radarChart.current) {
                radarChart.current = echarts.init(graph.current);
                radarChart.current.setOption(option);
            }
            else {
                radarChart.current.setOption(option);
            }
        }
    }, [rankList, memberInfo, mainColor, supColor]);

    return (
        <div
            ref = {graph}
            style = {{
                width: '25vw',
                height: '50vh',
            }}
        >
            Radar
        </div>
    );
};

export default Radar;
