import anime from 'animejs';
import React, { useEffect, useRef, useState } from 'react';
import AnimeController, { AnimeControllerHandle } from '../../commom/AnimeController';

import './Transition.less';

const DEFAULT_INTERVAL = 300;

function renderIcon() {
    const list = Array.from({ length: 10 });
    return list.map((val, index) => {
        if (index > 0) {
            return (
                <div
                    className = 'icon-mark'
                    // eslint-disable-next-line react/no-array-index-key
                    key = {`icon-mark${index}`}
                    style = {{
                        width: '100px',
                        height: '100px',
                        backgroundImage: `url(/api/assets/icon-mark/llss/${index}.png)`,
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            );
        }
        return false;
    });
}

const Transition = () => {
    const animationControllerRef = useRef<AnimeControllerHandle>(null);
    // 使用默认参数创建时间轴
    const timeline = useRef(
        anime.timeline({
            easing: 'easeOutQuint',
            duration: DEFAULT_INTERVAL,
            autoplay: true,
            update(anim) {
                if (animationControllerRef && animationControllerRef.current) {
                    animationControllerRef.current.setRangerValue(anim.progress);
                }
            },
        }),
    );

    useEffect(() => {
        const tl = timeline.current;
        tl
            // 排行榜信息高亮动画
            .add({
                targets: '.icon-mark',
                rotate: 360,
                delay: anime.stagger(100),
                duration: DEFAULT_INTERVAL * 5,
            });
    }, []);

    return (
        <div className = 'transition-container'>
            <div className = 'icon-container'>
                {renderIcon()}
            </div>
            <AnimeController timeline = {timeline} />
        </div>
    );
};

export default Transition;
