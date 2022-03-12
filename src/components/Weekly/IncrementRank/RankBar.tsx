import React, { FC, useState, useEffect } from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { ProjectName } from '@common/root';
import {
    charaRichMap,
    projectRichMap,
    ProjectColorMap,
} from '@src/constant';
import { GRID_MARGIN_TOP, TITLE_FONT_SIZE, TITLE_MARGIN_TOP } from '@src/constant/echarts-toolbox';
import { IncrementRank } from './common';

import './RankBar.less';

interface RankBarProps {
    title: string;
    range: string;
    linearGradient: string;
    icon: string;
    incrementRank: IncrementRank;
}

const RankBar: FC<RankBarProps> = ({ title, range, linearGradient, icon, incrementRank }) => {
    const chartOption: EChartsOption = {
        title: {
            text: title,
            subtext: `集计范围：${range}`,
            left: 'center',
            top: TITLE_MARGIN_TOP,
            textStyle: {
                fontSize: TITLE_FONT_SIZE,
            },
            subtextStyle: {
                fontSize: TITLE_FONT_SIZE / 2,
            },
        },
        grid: {
            top: GRID_MARGIN_TOP,
            left: '1%',
            right: '4%',
            bottom: '2%',
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
                    color: ['rgb(250,69,69, 10%)'],
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

    return (
        <div
            className = 'rank-bar-wrap'
            style = {{
                background: `linear-gradient(-45deg, ${linearGradient} 50px, white 50%, white)`,
            }}
        >
            <ReactECharts
                className = 'rank-bar'
                option = {chartOption}
                style = {{
                    width: '1200px',
                    height: '1000px',
                }}
            />
            <i className = {`iconfont ${icon}`} />
        </div>
    );
};

export default RankBar;
