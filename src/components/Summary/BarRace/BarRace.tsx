import React, { FC, useEffect, useRef, useState } from 'react';

import * as echarts from 'echarts';
import { characterRichMap, KeyofRomaColorMap, romaColorMap } from '@src/constant';
import { shadeRGBColor } from '@src/utils';
import { BarRaceDataSource } from './common';

import { newsList } from './news';

interface BarRaceProps {
    barRaceDataSet: BarRaceDataSource;
}

// 每 3s 更新一次数据
const DATA_UPDATE_INTERVAL = 500;
// 排序动画持续时间
const SORT_DURATION = 300;

const BarRace: FC<BarRaceProps> = ({ barRaceDataSet }) => {
    const barRace = useRef(null);
    const [news, setNews] = useState<any>(null);

    useEffect(() => {
        if (!barRace.current) {
            return;
        }

        const myChart = echarts.init(barRace.current);

        const [category, ...seriesData] = barRaceDataSet;
        const rawMember = category.slice(1);

        const dateStringList: string[] = [];
        const recordArray: number[][] = [];

        // 分离日期和数据
        for (const data of seriesData) {
            const [dateString, ...records] = data;
            dateStringList.push(dateString);
            recordArray.push(records);
        }

        let record = [0, 0, 0, 0, 0];
        let index = 0;
        const chartOption = {
            title: {
                text: 'Liella 成员推特关注数增量 since 2020-12-14',
                left: 'left',
                textStyle: {
                    fontSize: 32,
                },
            },
            grid: {
                left: '1%',
                right: '5%',
                bottom: '2%',
                containLabel: true,
            },
            xAxis: {
                // 表示用数据的最大值作为 X 轴最大值，视觉效果更好
                max: 'dataMax',
                axisLine: {
                    show: true,
                },
            },
            yAxis: {
                type: 'category',
                data: rawMember,
                // 表示 Y 轴从下往上是从小到大的排列
                inverse: true,
                // 表示第一次柱条排序动画的时长
                animationDuration: SORT_DURATION,
                // 表示第一次后柱条排序动画的时长
                animationDurationUpdate: SORT_DURATION,
                // only the largest n-1 bars will be displayed
                max: 4,
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
                        ...characterRichMap,
                    },
                },
            },
            series: [
                {
                    // 表示开启 Y 轴的动态排序效果
                    realtimeSort: true,
                    type: 'bar',
                    data: record,
                    label: {
                        show: true,
                        position: 'right',
                        // 实时改变标签
                        valueAnimation: true,
                    },
                    itemStyle: {
                        color(params: any) {
                            const [name, romaName] = params.name.split('-');
                            const col = romaColorMap[romaName as KeyofRomaColorMap];

                            return {
                                type: 'linear',
                                x: 1,
                                y: 0,
                                x2: 0,
                                y2: 0,
                                colorStops: [
                                    { offset: 0, color: col },
                                    { offset: 0.6, color: col },
                                    { offset: 1, color: shadeRGBColor(col, 60) },
                                ],
                            };
                        },
                    },
                },
            ],
            legend: {
                show: true,
            },
            // 表示第一份数据不需要从 0 开始动画（如果希望从 0 开始则设为和 animationDurationUpdate 相同的值）
            animationDuration: 0,
            // 示每次更新动画时长，这一数值应与调用 setOption 改变数据的频率相同
            animationDurationUpdate: DATA_UPDATE_INTERVAL,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear',
        };

        // 图表的初始配置
        myChart.setOption(chartOption as any);

        // 每 3s 更新一次数据
        let timerId: NodeJS.Timer;
        let newsId = 0;
        const newsDateList = Object.keys(newsList);
        const renderInterval = () => {
            const lastDate = dateStringList[index];
            index++;
            const curDate = dateStringList[index] as keyof typeof newsList;

            if (!curDate) {
                return;
            }

            const lastDateTime = new Date(lastDate);
            const curDateTIme = new Date(curDate);

            // console.log('newsDateList[newsId]:', newsDateList[newsId]);
            const newsDateTime = new Date(newsDateList[newsId]);

            let newsOfDate;

            if (newsDateTime >= lastDateTime && newsDateTime <= curDateTIme) {
                newsOfDate = newsList[newsDateList[newsId++] as keyof typeof newsList];
            }

            // 更新当期的新闻
            if (newsOfDate) {
                setNews(newsOfDate);
            }
            else {
                setNews({
                    date: curDate,
                    title: null,
                });
            }

            const delay = index >= 45
                ? (newsOfDate
                    ? DATA_UPDATE_INTERVAL / 2
                    : DATA_UPDATE_INTERVAL / 7)
                : DATA_UPDATE_INTERVAL;

            timerId = setTimeout(() => {
                // 更新到下一项数据，echarts 会采取合适的动画进行 过渡
                record = recordArray[index];

                if (!record) {
                    return;
                }
                myChart.setOption({
                    series: [
                        {
                            type: 'bar',
                            data: record,
                        },
                    ],
                });

                // 递归调用自身
                renderInterval();
            }, delay);
        };
        renderInterval();
    }, [barRaceDataSet]);

    function renderNews() {
        if (!news) {
            return null;
        }
        const { date, title } = news;
        return (
            <div style = { {
                width: '35vw',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                padding: '0 10px',
                color: '#a6469d',
            } }
            >
                <p
                    className = 'news-date'
                    style = { {
                        fontSize: '64px',
                    } }
                >{ date }
                </p>
                <p
                    className = 'news-title'
                    style = { {
                        fontSize: '32px',
                        marginTop: '32px',
                    } }
                >{ title }
                </p>
                <div
                    className = 'news-image'
                    style = { {
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        justifyItems: 'center',
                    } }
                >
                    { title
                            && (
                                <img
                                    src = { `/api/assets/news/${date}/${1}.jfif` }
                                    style = { {
                                        width: '100%',
                                        margin: 'auto',
                                    } }
                                    alt = { title }
                                />
                            ) }
                </div>
            </div>
        );
    }

    return (
        <div style = { {
            display: 'flex',
            justifyContent: 'center',
        } }
        >
            <div
                ref = { barRace }
                style = { {
                    width: '65vw',
                    height: '100vh',
                } }
            />
            { renderNews() }
        </div>
    );
};
export default BarRace;
