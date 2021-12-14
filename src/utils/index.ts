/* eslint-disable no-bitwise */

type UnknownFunction = (...args: unknown[]) => unknown;
/**
 * 函数式编程，函数组合工具，按顺序传递返回值调用函数管道
 *
 * @returns
 */
export function compose<P>(): (arg: P) => P;
export function compose<A extends unknown[], B>(ab: (this: void, ...a: A) => B): (...args: A) => B;
export function compose<A extends unknown[], B, C>(
    bc: (this: void, b: B) => C,
    ab: (this: void, ...a: A) => B,
): (...args: A) => C;
export function compose<A extends unknown[], B, C, D>(
    cd: (this: void, c: C) => D,
    bc: (this: void, b: B) => C,
    ab: (this: void, ...a: A) => B,
): (...args: A) => D;
export function compose<A extends unknown[], B, C, D, E>(
    de: (this: void, d: D) => E,
    cd: (this: void, c: C) => D,
    bc: (this: void, b: B) => C,
    ab: (this: void, ...a: A) => B,
): (...args: A) => E;
export function compose<A extends unknown[], B, C, D, E, F>(
    ef: (this: void, e: E) => F,
    de: (this: void, d: D) => E,
    cd: (this: void, c: C) => D,
    bc: (this: void, b: B) => C,
    ab: (this: void, ...a: A) => B,
): (...args: A) => F;
export function compose(...funcs: UnknownFunction[]): UnknownFunction {
    if (funcs.length === 0) return (arg) => arg;
    if (funcs.length === 1) return funcs[0];
    // a是累加器，最终返回的函数
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function pipe<P>(): (arg: P) => P;
export function pipe<T extends unknown[], V>(
    ...funcs: readonly [
        (...args: any[]) => V,
        ...any[],
        (...args: T) => any
    ]
): (...args: T) => V
export function pipe(...funcs: UnknownFunction[]): UnknownFunction {
    if (funcs.length === 0) return (arg) => arg;
    if (funcs.length === 1) return funcs[0];
    // a是累加器，最终返回的函数
    return funcs.reduce((a, b) => (...args: unknown[]) => a(b(...args)));
}

/**
 * 数字转换成千分位字符串
 */
export function thousandSplit(number: number) {
    const thousandRegex = /(?!^)(?=(\d{3})+$)/g;
    return `${number}`.replace(thousandRegex, ',');
}

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
 * shadeRGBColor，负数变暗，正数变亮
 *
 * 参考：https://segmentfault.com/a/1190000010284529
 */
export function shadeRGBColor(col: string, amount: number) {
    let usePrefix = false;
    let rgbCol = col;

    if (col.startsWith('#')) {
        rgbCol = col.slice(1);
        usePrefix = true;
    }

    const colNum = Number.parseInt(rgbCol, 16);

    const r = getSafeRGBValue((colNum >> 16) + amount);

    const b = getSafeRGBValue(((colNum >> 8) & 0x00_FF) + amount);

    const g = getSafeRGBValue((colNum & 0x00_00_FF) + amount);

    let rgb = (g | (b << 8) | (r << 16)).toString(16);

    // 如果小于3位，需要加上前导0
    if (rgb.length < 3) {
        rgb = (`000${rgb}`).slice(-3);
    }

    return (usePrefix ? '#' : '') + rgb;
}

