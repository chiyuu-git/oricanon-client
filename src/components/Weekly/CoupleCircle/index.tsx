import React, { useState, useEffect, useContext } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

import { reqMemberList } from '@src/api';

import { AggregationType, BasicType, ProjectName } from '@chiyu-bit/canon.root';
import { MemberBasicInfo } from '@chiyu-bit/canon.root/member-info';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { WeeklyContext } from '../weekly-context-manager';
import { processMembers } from './process-chart-option';

import './index.less';

/**
 * 有副作用，指定 lineStyle label 即数据
 */
function decorateWithDataLabel(
    combinationMembers: ReturnType<typeof processMembers>,
    latestData: RecordWeeklyInfo['memberInfoList'],
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
                const { dataIndex } = params;
                const weekIncrement = latestData[dataIndex].weekIncrement >= 9
                    ? `(+${latestData[dataIndex].weekIncrement})`
                    : '';
                return `\n${latestData[dataIndex].record}${weekIncrement}`;
            },
        };
        return couple;
    });
}

// echarts option shape 参考按需引入的 component 结构，拼接成最终的 option
// 如何获取 echarts 暴露的 ts 接口？ 没必要我自己去拼接
const CoupleCircle = () => {
    const weeklyContext = useContext(WeeklyContext);
    const [chartOption, setChartOption] = useState<EChartsOption | null>(null);
    const [memberList, setMemberList] = useState<MemberBasicInfo<BasicType.chara>[] | null>(null);
    const weeklyInfo = weeklyContext[BasicType.couple][AggregationType.coupleUnionIllust];

    /**
     * 获取 liella memberList
     */
    useEffect(() => {
        async function getIconImg() {
            const liellaMemberList = await reqMemberList({
                projectName: ProjectName.llss,
                basicType: BasicType.chara,
            });
            setMemberList(liellaMemberList);
        }
        getIconImg();
    }, []);

    /**
     * 获取 weeklyInfo 并 setOption
     */
    useEffect(() => {
        if (weeklyInfo) {
            const latestData = weeklyInfo.memberInfoList;

            const liellaMember = ['kanon', 'keke', 'chisato', 'sumire', 'ren'] as const;

            const memberLinks = decorateWithDataLabel(
                processMembers(liellaMember),
                latestData,
            );

            const option: EChartsOption = {
                title: {
                    text: 'pixiv-illust-角色cp榜',
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
                        roam: false,
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
                            { name: 'kanon', x: 0, y: -951 },
                            { name: 'keke', x: 1309, y: 0 },
                            { name: 'chisato', x: 809, y: 1539 },
                            { name: 'sumire', x: -809, y: 1539 },
                            { name: 'ren', x: -1309, y: 0 },
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

    function renderIconImg(liellaMemberList: MemberBasicInfo<BasicType.chara>[]) {
        return liellaMemberList.map(({ projectName, name, supportColor }) => (
            <div
                key = { name }
                className = 'icon'
                style = { {
                    backgroundImage: `url(/api/assets/icon/${projectName}/${name}.png)`,
                    borderColor: supportColor,
                } }
            />
        ));
    }

    return (
        <div className = 'couple-circle-wrap'>
            { chartOption && (
                <>
                    <ReactECharts
                        option = { chartOption }
                        style = { {
                            width: '800px',
                            height: '600px',
                        } }
                    />
                    { memberList && renderIconImg(memberList) }
                </>
            ) }
        </div>
    );
};

export default CoupleCircle;
