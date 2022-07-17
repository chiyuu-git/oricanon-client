/* eslint-disable no-bitwise */
import chroma from 'chroma-js';
/**
 * @file color 颜色相关的工具函数
 */

/**
 * 保证 rgb 值是合法的，即大于0小于255
 */
function getSafeRGBValue(value: number) {
    let res = value;

    if (res > 255) {
        res = 255;
    }
    else if (res < 0) {
        res = 0;
    }
    return res;
}

/**
 * 解析 col 字符串，返回 r g b [0-255]
 */
export function getRGBList(hexCol: string, amount = 0) {
    let hex = hexCol;

    if (hexCol.startsWith('#')) {
        hex = hexCol.slice(1);
    }

    const bigint = Number.parseInt(hex, 16);

    // const r = getSafeRGBValue((colNum >> 16) + amount);

    // const b = getSafeRGBValue(((colNum >> 8) & 0x00_FF) + amount);

    // const g = getSafeRGBValue((colNum & 0x00_00_FF) + amount);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

function rgb2Hex([r, g, b]: number[], usePrefix: boolean) {
    const hex = (g | (b << 8) | (r << 16)).toString(16);

    // 如果小于 n 位，需要加上 6 - n 个 前导0
    const prefixZero = Array.from({ length: 6 - hex.length }).fill(0).join('');

    return (usePrefix ? '#' : '') + prefixZero + hex;
}

/**
 * shadeRGBColor，负数变暗，正数变亮
 *
 * 参考：https://segmentfault.com/a/1190000010284529
 */
export function shadeRGBColor(col: string, amount: number) {
    const [r, g, b] = getRGBList(col, amount);

    return rgb2Hex([r, g, b], col.startsWith('#'));
}

/**
 * 根据背景色获取合适的前景色
 * https://www.codenong.com/3942878/
 * https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
 * https://css-tricks.com/switch-font-color-for-different-backgrounds-with-css/
 */
export function getForegroundColorByBackground(col: string) {
    // 实现一，效果感觉不是很好
    // const [r, g, b] = getRGBList(col);
    // return (r * 0.299 + g * 0.587 + b * 0.114) > 186
    //     ? '#000'
    //     : '#fff';

    // 实现二
    // const [r, g, b] = getRGBList(col).map((val) => {
    //     const temp = val / 255;
    //     if (temp <= 0.039_28) {
    //         return temp / 12.92;
    //     }

    //     return ((temp + 0.055) / 1.055) ^ 2.4;
    // });
    // const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // return l > 0.179 ? '#000000' : '#ffffff';

    // Gets the average value of the colors
    // 实现三，亲测好用
    // const [r, g, b] = getRGBList(col);
    // const contrastRatio = (r + g + b) / (255 * 3);

    // return contrastRatio >= 0.5
    //     ? '#000000'
    //     : '#ffffff';

    // 实现四
    // https://www.fly63.com/article/detial/2925
    const [r, g, b] = getRGBList(col);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    // return (yiq >= 128) ? '#000000' : '#ffffff';
    // console.log('yiq:', yiq);
    return (yiq >= 150) ? '#000000' : '#ffffff';
}
/**
 * 获取互补色
 * https://blog.csdn.net/chelen_jak/article/details/108508694
 */
export function getComplementaryColor(col: string) {
    const [r, g, b] = getRGBList(col);
    // return rgb2Hex([255 - r, 255 - g, 255 - b], col.startsWith('#'));
    return '#a6469d';
}

/**
 * 获取配色表
 * https://github.com/gka/chroma.js
 * https://zhuanlan.zhihu.com/p/353749546
 */
export function getSequentialPalette(col: string, count: number) {
    return chroma.scale([col, 'white']).colors(count);
}
