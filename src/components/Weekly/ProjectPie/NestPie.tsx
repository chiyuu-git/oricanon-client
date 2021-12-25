import React, { FC, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

import { ProjectShorthandMap, ProjectColorMap, characterRichMap } from '@src/constant';
import { BasicType, ProjectName } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { MemberInfoMap } from '@chiyu-bit/canon.root/member-list';

import './NestPie.less';

type NestPipeProps = {
    title: string;
    range: string;
    showWidget: boolean;
    size: {
        width: string;
        height: string;
    };
    memberInfoMap: MemberInfoMap<BasicType.character>;
} & RecordWeeklyInfo

interface PieDataItem {
    name: string;
    romaName: string;
    value: number;
    projectName: ProjectName;
}

const NestPie: FC<NestPipeProps> = (props) => {
    const {
        memberInfoMap,
        projectInfoList,
        memberInfoList,
        title, range, showWidget, size,
    } = props;

    // 处理legend，总结先周比
    const projectLegend: Record<string, string> = {};
    for (const { projectName, projectWeekIncrementRate } of projectInfoList) {
        const key = ProjectShorthandMap[projectName];
        // 修饰先周比
        let rateStr = projectWeekIncrementRate;
        if (projectName === ProjectName.ll) {
            rateStr = `先周比：${projectWeekIncrementRate}`;
        }

        projectLegend[key] = `${key} - (${rateStr})`;
    }

    type MemberShow = Record<ProjectName, boolean>;

    const projectMemberShow: MemberShow = Object.values(ProjectName).reduce((map, val) => ({
        ...map,
        [val]: true,
    }), {} as MemberShow);

    // 处理内圆的数据
    const projectPie = projectInfoList.map((project) => {
        const { projectName, projectWeekIncrement } = project;
        // 周增小于0，内环外环都不应该展示
        if (projectWeekIncrement < 0) {
            projectMemberShow[projectName] = false;
        }

        return {
            name: projectName,
            value: projectWeekIncrement,
        };
    });

    // 处理外环的 pie
    const memberPie: PieDataItem[] = [...memberInfoList]
        .sort((a, b) => {
            // 企划内部内先排一个序，才能和内圆吻合
            const aProjectName = memberInfoMap[a.romaName].projectName;
            const bProjectName = memberInfoMap[b.romaName].projectName;

            if (aProjectName === bProjectName) {
                return b.weekIncrement - a.weekIncrement;
            }
            return 1;
        })
        .map(({ romaName, weekIncrement }) => {
            const { name, projectName } = memberInfoMap[romaName];
            return {
                name,
                romaName,
                // 值为复数，或者企划整体周增小0，则过滤掉
                value: weekIncrement < 0 || !projectMemberShow[projectName] ? 0 : weekIncrement,
                projectName,
            };
        });

    const chartOption: EChartsOption = {
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
                center: ['50%', '50%'],
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
                center: ['50%', '50%'],
                // 量太小的就不显示了
                minAngle: 0,
                minShowLabelAngle: 10,
                data: memberPie,
                label: {
                    formatter(param) {
                        const { name, value, percent, data } = param;
                        // 每个角色使用自己的代表色
                        return `\n {${(data as PieDataItem).romaName}|${name}: ${value} }{per|${percent}%} \n`;
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
                        const { projectName } = param.data as PieDataItem;
                        return ProjectColorMap[projectName as ProjectName];
                    },
                    borderColor: 'white',
                },

            },
        ],
    };

    if (showWidget) {
        chartOption.legend = {
            orient: 'vertical',
            left: 10,
            top: 50,
            // 内外圆公用的legend
            data: Object.values(ProjectName),
            formatter(name) {
                return projectLegend[ProjectShorthandMap[name as ProjectName]];
            },
        };

        chartOption.graphic = [
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

    return (
        <div
            className = 'nest-pie-wrap'
            style = { {
                height: '700px',
            } }
        >
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
