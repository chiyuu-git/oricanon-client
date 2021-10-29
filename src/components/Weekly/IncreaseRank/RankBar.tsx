// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO:
import React, { FC, useState, useEffect } from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
    characterRomeMap,
    KeyofCharacterRomeMap,
    characterRichMap,
    projectRichMap,
    ProjectColorMap,
} from '@src/constant';
import { IncreaseRank } from './common';

import './RankBar.less';

interface RankBarProps {
    title: string;
    range: string;
    increaseRank: IncreaseRank;
}

const RankBar: FC<RankBarProps> = ({ title, range, increaseRank }) => {
    const [chartOption, setChartOption] = useState<EChartsOption | null>(null);

    useEffect(() => {
        const option: EChartsOption = {
            title: {
                text: title,
                subtext: `集计范围：${range}`,
                left: 'center',
                textStyle: {
                    fontSize: 24,
                },
                subtextStyle: {
                    fontSize: 16,
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                top: 80,
                containLabel: true,
            },
            dataset: {
                // 用 dimensions 指定了维度的顺序。直角坐标系中，
                // 默认把第一个维度映射到 X 轴上，第二个维度映射到 Y 轴上。
                // 如果不指定 dimensions，也可以通过指定 series.encode
                // 完成映射，参见后文。
                dimensions: ['name', 'increase'],
                source: increaseRank,
            },
            xAxis: {
                axisLine: {
                    show: true,
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee'],
                    },
                },
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    margin: 14,
                    formatter(name: KeyofCharacterRomeMap) {
                        const roma = characterRomeMap[name];
                        // 试了几个 key 使用 romaName 作为 key 可行
                        return `{${roma}|${name}}`;
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
            },
            series: [
                {
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'right',
                        formatter(param) {
                            const { dataIndex, data } = param;
                            const { increase, increaseRate, projectName } = data;

                            const increaseStr = `{${projectName}|  ${increase}}`;
                            const increaseRateStr = `{rate|  ${dataIndex === 37
                                ? '\n(先周比：'
                                : '('}${increaseRate})}`;
                            return increaseStr + increaseRateStr;
                        },
                        fontSize: 16,
                        rich: {
                            rate: {
                                fontSize: 12,
                                fontWeight: 'bold',
                            },
                            ...projectRichMap,
                        },
                    },
                    itemStyle: {
                        color(params) {
                            return ProjectColorMap[params.data.projectName];
                        },
                    },
                },
            ],
        };

        setChartOption(option);
    }, [title, range, increaseRank]);
    return (
        <div className = 'rank-bar-wrap'>
            { chartOption && (
                <ReactECharts
                    className = 'rank-bar'
                    option = { chartOption }
                    style = { {
                        width: '1200px',
                        height: '1000px',
                    } }
                />
            ) }
        </div>
    );
};

export default RankBar;
