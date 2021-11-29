import React, { FC, useState, useEffect } from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { ProjectName } from '@chiyu-bit/canon.root';
import {
    characterRichMap,
    projectRichMap,
    ProjectColorMap,
} from '@src/constant';
import { IncrementRank } from './common';

import './RankBar.less';

interface RankBarProps {
    title: string;
    range: string;
    incrementRank: IncrementRank;
}

const RankBar: FC<RankBarProps> = ({ title, range, incrementRank }) => {
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
                dimensions: ['nameAndRoma', 'increment'],
                source: incrementRank,
            },
            xAxis: {
                axisLine: {
                    show: true,
                },
                splitLine: {
                    interval: 1,
                    lineStyle: {
                        color: ['#eee'],
                    },
                },
                boundaryGap: ['0', '0.05'],
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    margin: 14,
                    formatter(nameAndRoma: string) {
                        const [name, romaName] = nameAndRoma.split('-');

                        if (name && romaName) {
                            // TODO: 执行次数过多
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
                            const {
                                increment,
                                incrementRateStr,
                                projectName,
                            } = data as unknown as IncrementRank[number];

                            if (projectName) {
                                return `{${projectName}|  ${increment}}{rate| ${incrementRateStr}}`;
                            }
                            const splitLine = '———————————————————————————';
                            // 分位线文本及补充分割线的样式
                            // eslint-disable-next-line max-len
                            return `{percentile|${splitLine} ${incrementRateStr}：${increment} ${splitLine}}`;
                        },
                        fontSize: 16,
                        rich: {
                            rate: {
                                fontSize: 12,
                                fontWeight: 'bold',
                            },
                            percentile: {
                                fontSize: 14,
                                fontWeight: 'bold',
                            },
                            ...projectRichMap,
                        },
                    },
                    labelLayout(params) {
                        if (params.text.includes('分位')) {
                            return {
                                // 从 item 的起点开启布局
                                x: params.rect.x,
                                y: params.rect.y + params.rect.height / 2,
                                verticalAlign: 'middle',
                                align: 'left',
                            };
                        }
                        // 返回 空对象 则取 label.position
                        return {};
                    },
                    itemStyle: {
                        color(params) {
                            const projectName = (params.data as IncrementRank[number]).projectName as ProjectName;
                            // 隐藏默认的item样式，全部采用 label 的样式
                            if (!projectName) {
                                return {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(0, 0, 0, 0)' },
                                        { offset: 1, color: 'rgba(0, 0, 0, 0)' },
                                    ],
                                };
                            }
                            return ProjectColorMap[projectName];
                        },
                    },
                },
            ],
        };

        setChartOption(option);
    }, [title, range, incrementRank]);

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
