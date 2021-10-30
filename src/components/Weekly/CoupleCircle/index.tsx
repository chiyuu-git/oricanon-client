import React, { useState, useEffect, useContext } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

import { MemberList, reqMemberList } from '@src/api';

import { AggregationType, BasicType, ProjectName } from '@chiyu-bit/canon.root';
import { RecordWeeklyInfo } from '@chiyu-bit/canon.root/weekly';
import { WeeklyContext } from '../weekly-context-manager';
import { processMembers } from './process-chart-option';

import './index.less';
/**
 * 有副作用，指定 lineStyle label 即数据
 */
function decorateWithDataLabel(
    combinationMembers: ReturnType<typeof processMembers>,
    latestData: RecordWeeklyInfo<BasicType.couple>['memberInfo'],
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
    const weeklyContext = useContext(WeeklyContext);
    const [chartOption, setChartOption] = useState<EChartsOption | null>(null);
    const [memberList, setMemberList] = useState<MemberList<BasicType.character> | null>(null);
    const PixivUnionIllustWeeklyInfo = weeklyContext[BasicType.couple][AggregationType.coupleUnionIllust];

    /**
     * 获取 liella memberList
     */
    useEffect(() => {
        async function getIconImg() {
            const liellaMemberList = await reqMemberList({
                projectName: ProjectName.llss,
                type: BasicType.character,
            });
            setMemberList(liellaMemberList);
        }
        getIconImg();
    }, []);

    /**
     * 获取 weeklyInfo 并 setOption
     */
    useEffect(() => {
        if (PixivUnionIllustWeeklyInfo) {
            const latestData = PixivUnionIllustWeeklyInfo.memberInfo;

            const liellaMember = ['kanon', 'keke', 'chisato', 'sumire', 'ren'] as const;

            const memberLinks = decorateWithDataLabel(
                processMembers(liellaMember),
                latestData,
            );

            const option: EChartsOption = {
                title: {
                    text: 'pixiv标签-角色cp榜',
                    subtext: `集计时间：${PixivUnionIllustWeeklyInfo.range.split('至')[1]}日`,
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
    }, [PixivUnionIllustWeeklyInfo]);

    function renderIconImg(liellaMemberList: MemberList<BasicType.character>) {
        const { projectName, list } = liellaMemberList;

        return list.map(({ name, supportColor }) => (
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
