/**
 * 动画控件，包装了原生的 input 添加更多功能
 */

import React, {
    FC,
    FormEvent,
    forwardRef,
    MutableRefObject,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { AnimeTimelineInstance } from 'animejs';

import './AnimeController.less';

export type AnimeControllerHandle = {
    setRangerValue: (value: number) => void;
}
interface AnimeControllerProps {
    timeline: MutableRefObject<AnimeTimelineInstance>;
    rangeMax?: number;
}

const AnimeController: React.ForwardRefRenderFunction<AnimeControllerHandle, AnimeControllerProps> = (
    { timeline, rangeMax = 100 },
    ref,
) => {
    const controllerState = useRef(true);
    const [rangerValue, setRangerValue] = useState(0);
    const [showController, setShowController] = useState(false);

    useImperativeHandle(ref, () => ({
        setRangerValue,
    }));

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
                value = {rangerValue}
                onInput = {handleProcessInput}
            />
        </div>
    );
};

export default forwardRef(AnimeController);
