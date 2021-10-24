import React, { FC, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

import { ProjectShorthandMap, ProjectColorMap, characterRichMap } from '@src/constant';
import { ModuleInfo } from '@chiyu-bit/canon.root/weekly';
import { BasicType, ProjectName } from '@chiyu-bit/canon.root';

import './NestPie.less';

type NestPipeProps = {
    title: string;
    range: string;
    showWidget: boolean;
    size: {
        width: string;
        height: string;
    };
} & ModuleInfo<BasicType.character>

const NestPie: FC<NestPipeProps> = (props) => {
    const { projectInfo, memberInfo, title, range, showWidget, size } = props;
    const [chartOption, setChartOption] = useState<EChartsOption | null>(null);
    // const [memberList, setMemberList] = useState<MemberList<BasicType.character> | null>(null);

    useEffect(() => {
        // 处理legend，总结先周比
        const projectLegend: Record<string, string> = {};
        for (const { projectName, projectWeekIncreaseRate } of projectInfo) {
            const key = ProjectShorthandMap[projectName];
            projectLegend[key] = `${key} - (${projectWeekIncreaseRate})`;
        }

        // 处理内圆的数据
        const projectPie = projectInfo.map((project) => {
            const { projectName, projectWeekIncrease } = project;
            return {
                name: projectName,
                value: projectWeekIncrease,
            };
        });

        // 处理外环的 pie
        const memberPie = [...memberInfo]
            .sort((a, b) => {
                // 企划内部内先排一个序，才能和内圆吻合
                if (a.projectName === b.projectName) {
                    return b.weekIncrease - a.weekIncrease;
                }
                return 1;
            })
            .map(({ name, romaName, weekIncrease, projectName }) => ({
                name,
                romaName,
                value: weekIncrease < 0 ? 0 : weekIncrease,
                projectName,
            }));

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
            series: [
                {
                    type: 'pie',
                    radius: [0, '30%'],
                    label: {
                        position: 'inner',
                        formatter(param) {
                            const { name, value, percent } = param;
                            return `${ProjectShorthandMap[name as ProjectName]}：${value}\n(${percent}%)`;
                        },
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 'bold',
                    },
                    data: projectPie,
                    itemStyle: {
                        color(param) {
                            return ProjectColorMap[param.name as ProjectName];
                        },
                    },
                },
                {
                    // name: '访问来源',
                    type: 'pie',
                    // 显示南丁格尔图
                    roseType: 'radius',
                    radius: ['40%', '55%'],
                    // 量太小的就不显示了
                    minAngle: 0,
                    minShowLabelAngle: 10,
                    data: memberPie,
                    label: {
                        formatter(param) {
                            const { name, value, percent, data } = param;
                            // 每个角色使用自己的代表色
                            return `\n {${data.romaName}|${name}: ${value} }{per|${percent}%} \n`;
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
                    itemStyle: {
                        // 依照组合给item设置颜色
                        color(param) {
                            const { projectName } = param.data;
                            return ProjectColorMap[projectName as ProjectName];
                        },
                        borderColor: 'white',
                    },

                },
            ],
        };

        if (showWidget) {
            option.legend = {
                orient: 'vertical',
                left: 10,
                top: 50,
                // 内外圆公用的legend
                data: Object.values(ProjectName),
                formatter(name) {
                    return projectLegend[ProjectShorthandMap[name as ProjectName]];
                },
            };

            option.graphic = [
                {
                    type: 'group',
                    right: 10,
                    top: 50,
                    children: [
                        {
                            type: 'rect',
                            z: 100,
                            left: 'center',
                            top: 'middle',
                            shape: {
                                width: 180,
                                height: 80,
                            },
                            style: {
                                fill: '#fff',
                                stroke: 'grey',
                                lineWidth: 1,
                            },
                        },
                        {
                            type: 'text',
                            z: 100,
                            left: 'center',
                            top: 'middle',
                            style: {
                                fill: '#333',
                                text: [
                                    '1. 图例百分数代表企划的先周比\n',
                                    '2. 内圆是企划整体的周增及占比\n',
                                    '3. 外环是主要角色的周增及占比',
                                ].join('\n'),
                                font: '12px Microsoft YaHei',
                            },
                        },
                    ],
                },
            ];
        }

        setChartOption(option);
    }, [projectInfo, memberInfo, title, range, showWidget]);
    return (
        <div className = 'nest-pie-wrap'>
            { chartOption && (
                <ReactECharts
                    option = { chartOption }
                    style = { size }
                />
            ) }
        </div>
    );
};

export default NestPie;
