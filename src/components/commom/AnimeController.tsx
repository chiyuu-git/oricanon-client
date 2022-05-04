/**
 * 动画控件，包装了原生的 input 添加更多功能
 */

import React, { FC, FormEvent, MutableRefObject, useEffect, useRef, useState } from 'react';
import { AnimeTimelineInstance } from 'animejs';

import './AnimeController.less';

interface AnimeControllerProps {
    timeline: MutableRefObject<AnimeTimelineInstance>;
    value: number;
    rangeMax?: number;
}

const AnimeController: FC<AnimeControllerProps> = ({ timeline, value, rangeMax = 100 }) => {
    const controllerState = useRef(true);
    const [showController, setShowController] = useState(false);

    useEffect(() => {
        // 初始化时隐藏，通过空格控制显隐
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setShowController(!controllerState.current);
                controllerState.current = !controllerState.current;
            }
        });
    }, []);

    function handleProcessInput(e: FormEvent<HTMLInputElement>) {
        const tl = timeline.current;
        tl.seek(tl.duration * (+e.currentTarget.value / rangeMax));
    }

    return (
        <div className = {`anime-controller ${showController ? '' : 'hide-controller'}`}>
            <div className = 'anime-button' onClick = {timeline.current.play}>PLAY</div>
            <div className = 'anime-button' onClick = {timeline.current.pause}>PAUSE</div>
            <div className = 'anime-button' onClick = {timeline.current.restart}>RESTART</div>
            <input
                className = 'range'
                type = 'range'
                step = '1'
                min = '0'
                max = {rangeMax}
                value = {value}
                onInput = {handleProcessInput}
            />
        </div>
    );
};

export default AnimeController;
