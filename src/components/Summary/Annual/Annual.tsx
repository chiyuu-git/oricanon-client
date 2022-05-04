import React, { FC, FormEvent, useEffect, useRef, useState } from 'react';
import anime from 'animejs';

import './Annual.less';
import { reqProjectRelativeIncrementInfo } from '@src/api';
import { Category, ProjectName } from '@common/root';
import { CharaMemberIncrementInfo, dimensionTitleMap, DIMENSION_LIST, SummaryRecordType } from '@common/summary';
import { thousandSplit } from '@utils/index';
import { CharaRecordType, FavorRecordTypeList } from '@common/record';
import StackBar from '@components/commom/StackBar';
import { getComplementaryColor, getForegroundColorByBackground, shadeRGBColor } from '@utils/color';
import { H2_FONT_SIZE, H3_FONT_SIZE, H4_FONT_SIZE } from '@src/constant/echarts-toolbox';
import { ProjectColorMap } from '@src/constant';
import Radar from './Radar';
import ProjectMemberLine from '../../commom/Line';
import AnimeController from '../../commom/AnimeController';

const DEFAULT_INTERVAL = 300;

const Annual: FC<unknown> = (props) => {
    const [rangerValue, setRangerValue] = useState(0);
    const [dimensionRankList, setDimensionRankList] = useState<CharaMemberIncrementInfo[][] | null>(null);
    const [activeMemberInfo, setActiveMemberInfo] = useState<CharaMemberIncrementInfo | null>(null);
    const [mainColor, setMainColor] = useState<string>('');
    const [hideMemberList, setHideMemberList] = useState<string[]>([]);
    const [showLineRace, setShowLineRace] = useState(true);
    const [showStackBar, setShowStackBar] = useState(true);
    const [stackValList, setStackValList] = useState<number[][] | null>(null);

    // 使用默认参数创建时间轴
    const timeline = useRef(
        anime.timeline({
            easing: 'easeOutQuint',
            duration: DEFAULT_INTERVAL,
            autoplay: true,
            update(anim) {
                setRangerValue(anim.progress);
            },
        }),
    );

    // fetch 数据并进行处理
    useEffect(() => {
        async function getProjectRelativeIncrementInfo() {
            const incrementInfo = await reqProjectRelativeIncrementInfo(
                Category.chara,
                ProjectName.lls,
                '2021-01-01',
            );

            // 1. 计算各个维度的排行榜
            const sortedInfoList = DIMENSION_LIST.map((recordType, index) => {
                const info = [...incrementInfo];
                return info.sort((a, b) => b[recordType] - a[recordType]);
            });

            setDimensionRankList(sortedInfoList);

            // 2. 记录当前要展示的成员信息，以 illust 排行榜倒序，作为展示顺序
            const activeIndex = 8;
            const memberInfo = sortedInfoList[0][activeIndex];
            setActiveMemberInfo(memberInfo);

            // 3. 计算 stackBarInfo
            const memberStackValue = FavorRecordTypeList.map((recordType) => memberInfo[recordType]);

            const projectAveStackValue: number[] = [];

            const projectMidStackValue: number[] = [];

            for (const recordType of FavorRecordTypeList) {
                const valueListOfType = incrementInfo.map((member) => member[recordType]).sort((a, b) => a - b);
                const projectSum = valueListOfType.reduce((acc, num) => acc + num);
                projectAveStackValue.push(+(projectSum / (incrementInfo.length - 1)).toFixed(0));
                projectMidStackValue.push(valueListOfType[6]);
            }

            setStackValList([
                memberStackValue,
                projectAveStackValue,
                projectMidStackValue,
            ]);

            // 4. 计算出 hideList 即可， active 由 animation 触发显示
            const hideList = sortedInfoList[0].slice(0, activeIndex + 1);
            setHideMemberList(hideList.map((member) => member.romaName));
        }
        getProjectRelativeIncrementInfo();
    }, []);

    // 开始执行动画逻辑
    useEffect(() => {
        if (hideMemberList.length === 0 || !dimensionRankList || !activeMemberInfo) {
            return;
        }
        const { romaName, supportColor } = activeMemberInfo;
        const mainFontColor = getForegroundColorByBackground(supportColor);
        const restColor = getComplementaryColor(supportColor);
        const tl = timeline.current;
        tl
            // 排行榜信息高亮动画
            .add({
                targets: `.${romaName}-detail`,
                backgroundColor: 'rgb(253, 174, 3)',
                duration: DEFAULT_INTERVAL * 5,
            })
            .add({
                targets: `.${romaName}-value`,
                opacity: 1,
                duration: DEFAULT_INTERVAL * 5,
                endDelay: DEFAULT_INTERVAL * 15,
            }, `-=${DEFAULT_INTERVAL * 5}`)
            // 展示雷达图
            .add({
                targets: '.ranking-title',
                fontSize: H3_FONT_SIZE,
                duration: DEFAULT_INTERVAL * 5,
            })
            .add({
                targets: '.ranking-detail',
                fontSize: H4_FONT_SIZE,
                duration: DEFAULT_INTERVAL * 5,
            }, `-=${DEFAULT_INTERVAL * 5}`)
            .add({
                targets: '.member-info-container',
                width: '25vw',
                opacity: 1,
                duration: DEFAULT_INTERVAL * 5,
                endDelay: DEFAULT_INTERVAL * 10,
                complete() {
                    setMainColor(supportColor);
                },
            }, `-=${DEFAULT_INTERVAL * 5}`)
            // 显示成员头像 一件更换 主题颜色为成员色
            .add({
                targets: '.profile-container',
                flex: 1,
                duration: DEFAULT_INTERVAL * 5,
            })
            .add({
                targets: `.${romaName}-detail`,
                backgroundColor: supportColor,
                color: mainFontColor,
                duration: DEFAULT_INTERVAL * 5,
            }, `-=${DEFAULT_INTERVAL * 5}`)
            .add({
                targets: `.${romaName}-name`,
                opacity: 1,
                duration: DEFAULT_INTERVAL * 5,
                endDelay: DEFAULT_INTERVAL * 10,
            }, `-=${DEFAULT_INTERVAL * 5}`)
            // switch the first graph
            .add({
                targets: '.dimension-area',
                translateY: '-100%',
                duration: DEFAULT_INTERVAL * 5,
            })
            .add({
                targets: '.selector-button',
                borderBottom: '4px solid rgba(0, 0, 0, 0)',
                duration: DEFAULT_INTERVAL * 5,
            }, `-=${DEFAULT_INTERVAL * 5}`)
            .add({
                targets: '.selector-button:nth-of-type(1)',
                borderColor: restColor,
                color: restColor,
                duration: DEFAULT_INTERVAL * 5,
                begin() {
                    setShowLineRace(true);
                },
            }, `-=${DEFAULT_INTERVAL * 5}`)
            .add({
                targets: '.selector-button:nth-of-type(1)>.progress',
                width: '100%',
                easing: 'linear',
                duration: DEFAULT_INTERVAL * 50,
            })
            // switch graph
            .add({
                targets: '.selector-button:nth-of-type(1)>.progress',
                opacity: 0,
                duration: DEFAULT_INTERVAL * 5,
            })
            .add({
                targets: '.selector-button:nth-of-type(1)',
                borderColor: 'rgba(0, 0, 0, 0)',
                color: 'rgb(0,0,0)',
                duration: DEFAULT_INTERVAL * 5,
            }, `-=${DEFAULT_INTERVAL * 5}`)
            .add({
                targets: '.selector-button:nth-of-type(2)',
                borderColor: restColor,
                color: restColor,
                duration: DEFAULT_INTERVAL * 5,
            }, `-=${DEFAULT_INTERVAL * 5}`)
            .add({
                targets: '.graph-swiper-item',
                translateX: '-100%',
                duration: DEFAULT_INTERVAL * 5,
                begin() {
                    // setShowStackBar(true);
                },
            }, `-=${DEFAULT_INTERVAL * 5}`)
            .add({
                targets: '.selector-button:nth-of-type(2)>.progress',
                width: '100%',
                easing: 'linear',
                duration: DEFAULT_INTERVAL * 30,
            });
    }, [dimensionRankList, activeMemberInfo, hideMemberList]);

    function renderRankList(
        rankList: CharaMemberIncrementInfo[][],
        index: number,
        recordType: CharaRecordType | SummaryRecordType,
    ) {
        if (!rankList) {
            return <div>rankList</div>;
        }
        return rankList[index].map((memberInfo, i) => {
            const { name, romaName, supportColor } = memberInfo;
            const shouldHide = hideMemberList.includes(romaName);
            return (
                <div
                    className = {`ranking-detail ${romaName}-detail`}
                    key = {name}
                >
                    <div className = 'rank'>
                        {i + 1}
                    </div>
                    <div className = {`member-name ${romaName}-name ${shouldHide ? 'hide' : ''}`}>
                        {name}
                    </div>
                    <div className = {`value ${romaName}-value ${shouldHide ? 'hide' : ''}`}>
                        {thousandSplit(memberInfo[recordType])}
                        {recordType.includes('rate') && '%'}
                    </div>
                </div>
            );
        });
    }

    function renderMemberDimensionDetail(memberInfo: CharaMemberIncrementInfo) {
        return DIMENSION_LIST.map((recordType, i) => {
            const { name } = memberInfo;
            const value = memberInfo[recordType];
            const isRateType = recordType.includes('rate');
            return (
                <div
                    className = 'dimension-detail'
                    style = {{ fontSize: H3_FONT_SIZE }}
                    key = {recordType}
                >
                    <i className = {`iconfont icon-${recordType.replace(/_/g, '-')}`} />
                    <span className = 'value '>
                        {thousandSplit(value)}
                        {isRateType && '%'}
                    </span>
                    {isRateType && (
                        <span className = 'supplement'>
                            ({Math.round((value / 100) * memberInfo[CharaRecordType.illust])})
                        </span>
                    )}
                </div>
            );
        });
    }

    if (!dimensionRankList || !activeMemberInfo) {
        return <div>dimensionRankList</div>;
    }

    const { name, supportColor, recordOrder } = activeMemberInfo;
    return (
        <div className = 'annual-container'>
            <div className = 'member-info-container'>
                <div className = 'profile-container'>
                    <div
                        className = 'member-avatar'
                        style = {{
                            backgroundImage: `url(/api/assets/portrait/lls/${name}.png)`,
                            backgroundPosition: '50% 10%',
                            backgroundSize: '100%',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: shadeRGBColor(supportColor, 70),
                        }}
                    />
                    <div className = 'dimension-summary-container'>
                        {
                            renderMemberDimensionDetail(activeMemberInfo)
                        }
                    </div>
                </div>
                <div className = 'radar-container'>
                    {
                        dimensionRankList
                        && (
                            <Radar
                                rankList = {dimensionRankList}
                                memberInfo = {activeMemberInfo}
                                mainColor = {mainColor || ProjectColorMap.lln}
                                supColor = {mainColor ? getComplementaryColor(supportColor) : 'grey'}
                            />
                        )
                    }
                </div>
            </div>
            <div className = 'dimension-area'>
                <div className = 'dimension-ranking-container'>
                    {
                        DIMENSION_LIST.map((recordType, index) => (
                            <div className = 'ranking-container' key = {`${recordType}`}>
                                <div className = 'ranking-title'>
                                    <i className = {`iconfont icon-${recordType.replace(/_/g, '-')}`} />
                                    &nbsp;{dimensionTitleMap[recordType]}
                                </div>
                                <div className = 'ranking-content'>
                                    {
                                        renderRankList(dimensionRankList, index, recordType)
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className = 'dimension-info-container'>
                    <div className = 'dimension-selector' style = {{ fontSize: H3_FONT_SIZE }}>
                        <div className = 'selector-button'>
                            <div className = 'progress' style = {{ backgroundColor: mainColor }} />
                            <span>同人图-年增量详情</span>
                        </div>
                        <div className = 'selector-button'>
                            <div className = 'progress' style = {{ backgroundColor: mainColor }} />
                            <span>同人图-年增量-收藏率详情</span>
                        </div>
                    </div>
                    <div className = 'dimension-detail-container' />
                    <div className = 'dimension-graph-container'>
                        <div className = 'graph-swiper-item'>
                            {showLineRace && mainColor && (
                                <ProjectMemberLine
                                    mainColor = {mainColor}
                                    activeIndex = {recordOrder}
                                />
                            )}
                        </div>
                        <div className = 'graph-swiper-item'>
                            {showStackBar && stackValList && mainColor && (
                                <StackBar
                                    name = {name}
                                    mainColor = {mainColor}
                                    stackValList = {stackValList}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AnimeController timeline = {timeline} value = {rangerValue} />
        </div>
    );
};

export default Annual;
