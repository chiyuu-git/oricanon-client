import React, { useState, useEffect, useContext } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption, GraphSeriesOption } from 'echarts';
import { compose } from '@utils/index';

import { characterColorMap, CharacterColorRomaName } from '@src/constant';
import { ModuleInfo } from '@chiyu-bit/canon.root/weekly';
import { BasicType } from '@chiyu-bit/canon.root';
import { WeeklyContext } from '../weekly-context-manager';

/**
 * 根据 members 排列组合，返回一个二维数组
 * TODO: 从 lastData 获取 coupleList 不要自己生成了
 */
function getCombinationMembers(members: readonly CharacterColorRomaName[]) {
    return members.map((member, i) => {
        // 计算出要与多少名成员组合
        const target = members.slice(i + 1);
        const combination: NonNullable<GraphSeriesOption['links']> = [];
        if (target.length > 0) {
            for (const combineMember of target) {
                const item: (typeof combination)[number] = {
                    source: member,
                    target: combineMember,
                    lineStyle: {
                        width: 10,
                    },
                };
                combination.push(item);
            }
        }
        // 最后一个会是空数组，因为 ren 没有可以组合的对象， flat 后会自然消除
        return combination;
    });
}

/**
 * 有副作用，修改特定的 lineStyle ，画圆
 */
function decorateWithCircle(combinationMembers: ReturnType<typeof getCombinationMembers>) {
    return combinationMembers
        .flatMap((combinationMember, i) => {
            const couple = combinationMember;
            if (couple[0] && couple[0].lineStyle) {
                // 每个组合得第一个需要画圆
                // 边的曲度，支持从 0 到 1 的值，值越大曲度越大
                couple[0].lineStyle.curveness = 0.3;
            }
            if (i === 0) {
                // kanon 和 ren 需要把圆闭合
                const closeLineStyle = couple[couple.length - 1].lineStyle;
                if (closeLineStyle) {
                    closeLineStyle.curveness = -0.3;
                }
            }

            return couple;
        });
}

/**
 * 有副作用，修改特定的 lineStyle color
 */
function decorateWithColor(combinationMembers: ReturnType<typeof decorateWithCircle>) {
    // 渐变色设置，分别代表右下左上，需要每一条单独设定效果才好
    // 1代表开始的位置，0代表结束的位置
    const linearOptions = [
        // 从右下到左上
        { x: 1, y: 1, x2: 0, y2: 0 },
        { x: 0, y: 1, x2: 1, y2: 0 },
        { x: 0, y: 1, x2: 0, y2: 0 },
        { x: 0, y: 1, x2: 1, y2: 0 },
        { x: 0, y: 1, x2: 0, y2: 0 },
        { x: 0, y: 1, x2: 1, y2: 0 },
        { x: 0, y: 0, x2: 1, y2: 0 },
        { x: 0, y: 0, x2: 1, y2: 0 },
        { x: 0, y: 0, x2: 1, y2: 1 },
        { x: 0, y: 0, x2: 0, y2: 1 },
    ];

    return combinationMembers.map((combinationMember, i) => {
        const couple = combinationMember;
        const sourceColor = characterColorMap[couple.source as CharacterColorRomaName];
        const targetColor = characterColorMap[couple.target as CharacterColorRomaName];
        if (couple.lineStyle) {
            couple.lineStyle.color = {
                type: 'linear',
                ...linearOptions[i],
                colorStops: [
                    {
                        offset: 0.1,
                        color: sourceColor,
                    },
                    {
                        offset: 1,
                        color: targetColor,
                    },
                ],
            };
        }
        return couple;
    });
}

function decorateWithWidth(combinationMembers: ReturnType<typeof decorateWithCircle>) {
    // 按照占比来划分好了，目前可香占比超过了50%
    // 前三名单独width，中间五名递减width，最后2名统一为10
    const widthOptions = [35, 25, 10, 10, 10, 25, 10, 5, 5, 5];

    return combinationMembers.map((combinationMember, i) => {
        const couple = combinationMember;
        if (couple.lineStyle) {
            couple.lineStyle.width = widthOptions[i];
        }
        return couple;
    });
}

function decorateWithDataLabel(
    combinationMembers: ReturnType<typeof decorateWithCircle>,
    latestData: ModuleInfo<BasicType.couple>['memberInfo'],
) {
    return combinationMembers.map((combinationMember) => {
        const couple = combinationMember;
        couple.label = {
            show: true,
            // rotate: 90,
            // offset: [100, 100],
            fontWeight: 'bolder',
            fontSize: 16,
            align: 'center',
            verticalAlign: 'bottom',
            lineHeight: 0,
            formatter(params) {
                const { data, dataIndex } = params;
                const weekIncrease = latestData[dataIndex].weekIncrease >= 9
                    ? `(+${latestData[dataIndex].weekIncrease})`
                    : '';
                return `\n${latestData[dataIndex].record}${weekIncrease}`;
            },
        };
        return couple;
    });
}

// echarts option shape 参考按需引入的 component 结构，拼接成最终的 option
// 如何获取 echarts 暴露的 ts 接口？ 没必要我自己去拼接
const CoupleCircle = () => {
    const weeklyInfo = useContext(WeeklyContext);
    const [chartOption, setChartOption] = useState<EChartsOption | null>(null);
    // 获取 weeklyInfo
    useEffect(() => {
        if (weeklyInfo) {
            const latestData = weeklyInfo.coupleInfo.memberInfo;

            const memberList = ['kanon', 'keke', 'chisato', 'sumire', 'ren'] as const;

            const processMembers = compose(
                decorateWithWidth,
                decorateWithColor,
                decorateWithCircle,
                getCombinationMembers,
            );

            const memberLinks = decorateWithDataLabel(
                processMembers(memberList),
                latestData,
            );

            const option: EChartsOption = {
                title: {
                    text: 'pixiv标签-角色cp榜',
                    subtext: `集计时间：${weeklyInfo.range.split('至')[1]}日`,
                    left: 'left',
                    textStyle: {
                        fontSize: 24,
                    },
                    subtextStyle: {
                        fontSize: 16,
                    },
                },
                tooltip: {},
                //   animationDurationUpdate: 1500,
                //   animationEasingUpdate: "quinticInOut",
                series: [
                    {
                        type: 'graph',
                        layout: 'none',
                        symbolSize: 100,
                        roam: true,
                        label: {
                            show: true,
                        },
                        //   edgeSymbol: ["arrow", "arrow"],
                        // 边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定
                        //   edgeSymbolSize: [10, 10],
                        //   edgeLabel: {
                        //     fontSize: 40,
                        //   },
                        // 写死五角星布局
                        data: [
                            {
                                name: 'kanon',
                                x: 0,
                                y: -951,
                            },
                            {
                                name: 'keke',
                                x: 1309,
                                y: 0,
                            },
                            {
                                name: 'chisato',
                                x: 809,
                                y: 1539,
                            },
                            {
                                name: 'sumire',
                                x: -809,
                                y: 1539,
                            },
                            {
                                name: 'ren',
                                x: -1309,
                                y: 0,
                            },
                        ],
                        links: memberLinks,
                        lineStyle: {
                            opacity: 0.9,
                            width: 5,
                            curveness: 0,
                        },
                    },
                ],
            };

            setChartOption(option);
        }
    }, [weeklyInfo]);

    const imgCount = Array.from({ length: 5 });

    const imgEl = imgCount.map((item, index) => {
        const path = `src/assets/icon/hello/c0${index + 1}s.png`;
        return (
            <img
                key = {path}
                src = {require(`../../../assets/icon/hello/c0${index + 1}s.png`)}
                alt = ''
                style = {{
                    borderColor: '#ff7f27',
                }}
            />
        );
    });

    return (
        <>
            {chartOption && (
                <>
                    {imgEl}
                    {/* <img
                        src = 'src/assets/icon/hello/c01s.png'
                        alt = ''
                        style = {{
                            borderColor: '#ff7f27',
                        }}
                    />
                    <img
                        src = 'src/assets/icon/hello/c02s.png'
                        alt = ''
                        style = {{
                            borderColor: '#ff6e90',
                        }}
                    />
                    <img
                        src = 'src/assets/icon/hello/c03s.png'
                        alt = ''
                        style = {{
                            borderColor: '#ff6e90',
                        }}
                    />
                    <img
                        src = 'src/assets/icon/hello/c04s.png'
                        alt = ''
                        style = {{
                            borderColor: '#74f466',
                        }}
                    />
                    <img
                        src = 'src/assets/icon/hello/c05s.png'
                        alt = ''
                        style = {{
                            borderColor: '#0000a0',
                        }}
                    /> */}
                    <ReactECharts
                        option = {chartOption}
                        style = {{
                            width: '800px',
                            height: '600px',
                            margin: '0 auto',
                        }}
                    />
                </>
            )}
        </>
    );
};

export default CoupleCircle;
