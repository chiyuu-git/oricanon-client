/**
 * 日期切换组件
 */

import React, { FC, useEffect, useRef, useState } from 'react';
import { useRanger } from '@utils/use-ranger';

import './DateController.less';
import { getDayDifferent } from '@utils/date';

enum PLAY_STATE {
    playing = 'playing',
    paused = 'paused',
}
interface DateControllerProps {
    dateList: string[];
    dateIndex: number;
    setDateIndex: (dateIndex: number) => void;
    min: number;
    max: number;
    /**
     * 播放设置
     */
    playOption?: {
        /**
         * 切换到下周日期的 interval
         */
        interval: number;
    };
}

const DEFAULT_PLAY_OPTION = {
    interval: 300,
};

const DateController: FC<DateControllerProps> = ({
    dateList,
    dateIndex, setDateIndex, min, max,
    playOption = DEFAULT_PLAY_OPTION,
}) => {
    const { getTrackProps, handles, ticks, segments } = useRanger({
        min,
        max,
        stepSize: 1,
        values: [dateIndex],
        onDrag(values: number[]) {
            setDateIndex(values[0]);
        },
    });
    const [playState, setPlayState] = useState(PLAY_STATE.paused);
    const [show, setShow] = useState(false);
    const showController = useRef(false);

    // 记录 autoplay 时的定时器 id
    const playId = useRef<NodeJS.Timer | null>(null);
    // 记录上一个定时器指定的日期
    const prevDateStr = useRef<string | null>(null);

    useEffect(() => {
        // 初始化时隐藏，通过空格控制显隐
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setShow(!showController.current);
                showController.current = !showController.current;
            }
        });
    }, []);

    function handlePlay() {
        if (playId.current) {
            clearTimeout(playId.current);
        }

        let i = dateIndex;

        if (i >= max) {
            return;
        }

        if (!prevDateStr.current) {
            prevDateStr.current = dateList[i];
        }

        function intervalPlay() {
            if (i >= max) {
                // 中止 interval
                playId.current = null;
                setPlayState(PLAY_STATE.paused);
                return;
            }

            if (!prevDateStr.current) {
                return;
            }

            const curDateStr = dateList[i];
            const dayDiff = getDayDifferent(prevDateStr.current, curDateStr);

            playId.current = setTimeout(() => {
                intervalPlay();
                // 若与上一次 date 相差一天，则 delay 是 七分之一
            }, playOption.interval / (7 / dayDiff));

            // interval 条件更新
            prevDateStr.current = curDateStr;
            setDateIndex(++i);
        }

        setPlayState(PLAY_STATE.playing);
        // 点击 play 之后，马上进行 setDateIndex
        playId.current = setTimeout(intervalPlay, 0);
    }

    function handlePause() {
        if (playId.current && playState === PLAY_STATE.playing) {
            clearTimeout(playId.current);
            playId.current = null;
            setPlayState(PLAY_STATE.paused);
        }
    }

    function handlePrev() {
        const prevIndex = dateIndex - 1;
        if (prevIndex <= min) {
            return;
        }
        setDateIndex(prevIndex);
    }

    function handleNext() {
        const nextIndex = dateIndex + 1;
        if (nextIndex >= max) {
            return;
        }
        setDateIndex(nextIndex);
    }

    return (
        <div className = {`date-controller-container ${show ? '' : 'hide-controller'}`}>
            {
                playState === PLAY_STATE.paused
                    ? <div className = 'play-btn' onClick = {handlePlay}>播放</div>
                    : <div className = 'play-btn' onClick = {handlePause}>暂停</div>
            }
            <div className = 'prev-btn' onClick = {handlePrev}>{'<'}</div>
            <div className = 'next-btn' onClick = {handleNext}>{'>'}</div>
            <div className = 'speed-btn'>倍速</div>
            <div className = 'process-control-container'>
                <div
                    className = 'process-container'
                    {...getTrackProps({
                        style: {
                            position: 'relative',
                            height: '4px',
                            background: '#ddd',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)',
                            borderRadius: '2px',
                        },
                    })}
                >
                    {segments.map(({ getSegmentProps, key }, i) => (
                        <div
                            key = {key}
                            {...getSegmentProps({
                                style: {
                                    height: '10px',
                                    backgroundColor: 'red',
                                },
                            })}
                        />
                    ))}
                    {ticks.map(({ value, getTickProps, key }) => (
                        <div key = {key} {...getTickProps()}>{value}</div>
                    ))}
                    {handles.map(({ getHandleProps, key }) => (
                        <div
                            key = {key}
                            {...getHandleProps({
                                style: {
                                    width: '14px',
                                    height: '14px',
                                    outline: 'none',
                                    borderRadius: '100%',
                                    background: 'linear-gradient(to bottom, #eee 45%, #ddd 55%)',
                                    border: 'solid 1px #888',
                                },
                            })}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DateController;
