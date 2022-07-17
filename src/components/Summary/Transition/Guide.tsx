import anime from 'animejs';
import React, { useEffect, useRef, useState } from 'react';
import AnimeController from '../../commom/AnimeController';

import './Guide.less';

const DEFAULT_INTERVAL = 300;

function renderIcon() {
    const list = Array.from({ length: 10 });
    return list.map((val, index) => {
        if (index > 0) {
            const randomIndex = Math.round(Math.random() * 8) + 1;
            return (
                <div
                    className = 'icon-mark'
                    // eslint-disable-next-line react/no-array-index-key
                    key = {`icon-mark${index}`}
                    style = {{
                        width: '50px',
                        height: '50px',
                        backgroundImage: `url(/api/assets/icon-mark/llss/${randomIndex}.png)`,
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            );
        }
        return false;
    });
}

function renderColumn() {
    const list = Array.from({ length: 13 });
    return list.map((val, index) => {
        const oddStyle = { width: '90vw', justifyContent: 'space-around' };
        return (
            <div
                style = {index % 2 !== 0 ? oddStyle : {}}
                className = 'icon-container'
                // eslint-disable-next-line react/no-array-index-key
                key = {`icon-container${index}`}
            >
                {renderIcon()}
            </div>
        );
    });
}

function Transition() {
    const [rangerValue, setRangerValue] = useState(0);

    return (
        <div className = 'transition-container'>
            {renderColumn()}
            {/* <AnimeController timeline = {timeline} value = {rangerValue} /> */}
        </div>
    );
}

export default Transition;
