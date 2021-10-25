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

type Test2 = `names.${number}.firstName.lastName.${number}`;
type SplitTemplateStringTypeToTuple<T> =
  T extends `${infer First}.${infer Rest}`
  // 此分支表示需要继续递归
      ? First extends `${number}`
          ? [number, ...SplitTemplateStringTypeToTuple<Rest>] // 完全类似 JS 数组构造
          : [First, ...SplitTemplateStringTypeToTuple<Rest>]
  // 此分支表示抵达递归基，递归基不是 nubmer 就是 string
      : T extends `${number}`
          ? [number]
          : [T];
type TestSplitTemplateStringTypeToTuple = SplitTemplateStringTypeToTuple<Test2>;
