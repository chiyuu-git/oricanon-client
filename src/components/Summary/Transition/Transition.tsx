import anime from 'animejs';
import React, { useEffect, useRef, useState } from 'react';
import AnimeController from '../../commom/AnimeController';

import './Transition.less';

const DEFAULT_INTERVAL = 300;

function renderIcon() {
    const list = Array.from({ length: 13 });
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
                        backgroundImage: `url(/api/assets/icon-mark/lln/${index}.png)`,
                        backgroundSize: '100%',
                    }}
                />
            );
        }
        return false;
    });
}

const Transition = () => {
    const [rangerValue, setRangerValue] = useState(0);
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
            <AnimeController timeline = {timeline} value = {rangerValue} />
        </div>
    );
};

export default Transition;
