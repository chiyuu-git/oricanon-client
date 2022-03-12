/**
 * @file custom use ranger hook
 * https://github.com/tannerlinsley/react-ranger
 */

import React, { useRef, useCallback, useState, useMemo } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

interface TrackDims {
    left: number;
    width: number;
}

const getBoundingClientRect = (element: Element): TrackDims => {
    const rect = element.getBoundingClientRect();
    return {
        left: Math.ceil(rect.left),
        width: Math.ceil(rect.width),
    };
};

const sortNumList = <T>(arr: T[]) => [...arr].sort((a, b) => Number(a) - Number(b));

const useLatest = <T>(val: T) => {
    const ref = useRef(val);
    ref.current = val;
    return useCallback(() => ref.current, []);
};

/**
 * 线性插值器，类似的 贝塞尔曲线插值器
 */
const linearInterpolator = {
    // 计算当前值在 range 内的百分比
    getPercentageForValue(val: number, min: number, max: number) {
        return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    },

    getValueForClientX: (clientX: number, trackDims: TrackDims, min: number, max: number) => {
        const { left, width } = trackDims;
        const percentageValue = (clientX - left) / width;
        const value = (max - min) * percentageValue;
        return value + min;
    },
};
type Interpolator = typeof linearInterpolator;

/**
 * 自定义 hook useRanger，用于实现容器内范围选择的效果
 * 一个容器元素 track，多个 handle 元素
 */
interface HookRangerOption {
    values: number[];
    min: number;
    max: number;
    /**
     * The distance between selectable steps
     */
    stepSize: number;
    /**
     * An array of custom steps to use. This will override stepSize
     * 用于设置 track 中具体的 step，比如平方 2 4 6 8，step 逐渐增大
     */
    steps?: number[];
    interpolator?: Interpolator;
    /**
     * track 下标间隔
     */
    tickSize?: number;
    /**
     * An array of custom ticks to use. This will override tickSize
     * 自定义下标数组
     */
    ticks?: number[];
    onChange?: (values: number[]) => unknown;
    onDrag?: (values: number[]) => unknown;
}

interface HandleProps {
    onKeyDown?: (e: KeyboardEvent) => void;
    onMouseDown?: (e: MouseEvent) => void;
    style?: Record<string, unknown>;
}

interface TickProps {
    style?: Record<string, unknown>;
}

export function useRanger({
    values,
    min,
    max,
    steps,
    stepSize = 1,
    interpolator = linearInterpolator,
    ticks: controlledTicks,
    tickSize = 10,
    onChange,
    onDrag,
}: HookRangerOption) {
    const [activeHandleIndex, setActiveHandleIndex] = useState<number | null>(null);
    // 开发者如果没有在 onChange / onDrag 传递 setValues 进行更新，则 values 一直是旧值
    // 需要在 hook 内部保持最新的 values
    const [tempValues, setTempValues] = useState<number[] | null>(null);

    const getLatest = useLatest({
        activeHandleIndex,
        onChange,
        onDrag,
        values,
        tempValues,
    });

    const trackElRef = useRef<Element>();

    const getValueForClientX = useCallback((clientX: number) => {
        if (!trackElRef.current) {
            return null;
        }

        const trackDims = getBoundingClientRect(trackElRef.current);
        return interpolator.getValueForClientX(clientX, trackDims, min, max);
    },
    [interpolator, max, min]);

    const getPercentageForValue = useCallback(
        (val: number) => interpolator.getPercentageForValue(val, min, max),
        [interpolator, max, min],
    );

    /**
     * 用于箭头控制时，控制 step
     */
    const getNextStep = useCallback(
        (val: number, direction: number) => {
            if (steps) {
                const currIndex = steps.indexOf(val);
                const nextIndex = currIndex + direction;
                if (nextIndex >= 0 && nextIndex < steps.length) {
                    return steps[nextIndex];
                }
                return val;
            }

            // if (process.env.NODE_ENV !== 'production' && typeof stepSize === 'undefined') {
            //     throw new Error(
            //         'Warning: The option `stepSize` is expected in `useRanger`, but its value is `undefined`',
            //     );
            // }

            const nextVal = val + stepSize * direction;
            if (nextVal >= min && nextVal <= max) {
                return nextVal;
            }
            return val;
        },
        [max, min, stepSize, steps],
    );

    /**
     * 用于拖拽、点击时 round value to match step
     * TODO: 优化算法，直接用整除行不行？
     */
    const roundToStep = useCallback(
        (val: number) => {
            let left = min;
            let right = max;
            if (steps) {
                for (const step of steps) {
                    if (step <= val && step > left) {
                        left = step;
                    }
                    if (step >= val && step < right) {
                        right = step;
                    }
                }
            }
            else {
                // if (process.env.NODE_ENV !== 'production' && typeof stepSize === 'undefined') {
                //     throw new Error(
                //         'Warning: The option `stepSize` is expected in `useRanger`, but its value is `undefined`',
                //     );
                // }
                while (left < val && left + stepSize < val) {
                    left += stepSize;
                }

                right = Math.min(left + stepSize, max);
            }

            if (val - left < right - val) {
                return left;
            }
            return right;
        },
        [max, min, stepSize, steps],
    );

    const handleDrag = useCallback(
        (e: globalThis.MouseEvent) => {
            const { activeHandleIndex: latestActiveHandleIndex, onDrag: latestOnDrag } = getLatest();

            if (latestActiveHandleIndex === null) {
                return;
            }

            // const clientX = e.type === 'touchmove' ? e.changedTouches[0].clientX : e.clientX;
            const { clientX } = e;
            const newValue = getValueForClientX(clientX);

            if (!newValue) {
                return;
            }

            const newRoundedValue = roundToStep(newValue);

            const newValues = [
                ...values.slice(0, latestActiveHandleIndex),
                newRoundedValue,
                ...values.slice(latestActiveHandleIndex + 1),
            ];

            // 如果开发者传递了 onDrag 就不会 setTempValues 感觉有问题
            // 导致开发者 onchange 和 onDrag 都是一定要传的，否则 release 时 tempValues 设置为 null 后会归零
            // 两种方案：一种是开发者可以不传，values 的最新值维护在 hook 内不合适
            // 那只能是强迫开发者一定要传，而且一定要在 onchange setValues
            if (latestOnDrag) {
                latestOnDrag(newValues);
            }
            else {
                setTempValues(newValues);
            }
        },
        [getLatest, getValueForClientX, roundToStep, values],
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent, i) => {
            const { values: latestValues, onChange: latestOnChange = () => {} } = getLatest();
            // Left Arrow || Right Arrow
            if (e.keyCode === 37 || e.keyCode === 39) {
                setActiveHandleIndex(i);
                const direction = e.keyCode === 37 ? -1 : 1;
                const newValue = getNextStep(latestValues[i], direction);
                const newValues = [
                    ...latestValues.slice(0, i),
                    newValue,
                    ...latestValues.slice(i + 1),
                ];
                const sortedValues = sortNumList(newValues);
                latestOnChange(sortedValues);
            }
        },
        [getLatest, getNextStep],
    );

    const handlePress = useCallback(
        (handleIndex) => {
            // 记录 active handle
            setActiveHandleIndex(handleIndex);

            const handleRelease = (releaseEvent: globalThis.MouseEvent) => {
                const {
                    tempValues: latestTempValues,
                    values: latestValues,
                    onChange: latestOnChange = () => {},
                    onDrag: latestOnDrag = () => {},
                } = getLatest();

                document.removeEventListener('mousemove', handleDrag);
                // document.removeEventListener('touchmove', handleDrag);
                document.removeEventListener('mouseup', handleRelease);
                // document.removeEventListener('touchend', handleRelease);
                const sortedValues = sortNumList(latestTempValues || latestValues);
                latestOnChange(sortedValues);
                latestOnDrag(sortedValues);
                setActiveHandleIndex(null);
                setTempValues(null);
            };

            document.addEventListener('mousemove', handleDrag);
            // document.addEventListener('touchmove', handleDrag);
            document.addEventListener('mouseup', handleRelease);
            // document.addEventListener('touchend', handleRelease);
        },
        [getLatest, handleDrag],
    );

    // Build the ticks
    const buildTicks = useMemo(() => {
        let ticks = controlledTicks || steps;

        // 开发者没有自定义 ticks 时需生成
        if (!ticks) {
            ticks = [min];
            while (ticks[ticks.length - 1] < max - tickSize) {
                ticks.push(ticks[ticks.length - 1] + tickSize);
            }
            ticks.push(max);
        }

        return ticks.map((value, i) => ({
            value,
            key: `ticks${i}`,
            getTickProps: ({ style = {}, ...rest }: TickProps = {}) => ({
                style: {
                    position: 'absolute',
                    width: 0,
                    left: `${getPercentageForValue(value)}%`,
                    transform: 'translateX(-50%)',
                    userSelect: 'none',
                    ...style,
                } as const,
                ...rest,
            }),
        }));
    }, [controlledTicks, getPercentageForValue, max, min, steps, tickSize]);

    const segments = useMemo(() => {
        const sortedValues = sortNumList(tempValues || values);

        return [...sortedValues].map((value, i) => ({
            value,
            key: `segments${i}`,
            getSegmentProps: ({ style = {}, ...rest } = {}) => {
                const left = getPercentageForValue(
                    sortedValues[i - 1] ? sortedValues[i - 1] : min,
                );
                const width = getPercentageForValue(value) - left;
                return {
                    style: {
                        position: 'absolute',
                        left: `${left}%`,
                        width: `${width}%`,
                        ...style,
                    } as const,
                    ...rest,
                };
            },
        }));
    }, [getPercentageForValue, min, tempValues, values]);

    // 依据开发者初始化设置的 values 数组的长度设置相应个数的 handle
    const handles = useMemo(
        () => (tempValues || values).map((value, handleIndex) => ({
            // 暴露给 jsx 方便设置 curValue
            value,
            // 暴露给 jsx ，方便设置 active 样式，activeHandleIndex 是 state
            active: handleIndex === activeHandleIndex,
            // 暴露给开发者设置 map key，开发者也可以自行指定
            key: `handle${handleIndex}`,
            getHandleProps: ({
                // TODO: ref 参数的作用？
                // ref,
                // innerRef = () => {},
                onKeyDown,
                onMouseDown,
                // onTouchStart,
                style = {},
                ...rest
            }: HandleProps = {}) => ({
                // react 需要加上 tabIndex 元素才支持响应 keyboard 事件
                tabIndex: handleIndex,
                onKeyDown: (e: KeyboardEvent) => {
                    // e.persist();
                    handleKeyDown(e, handleIndex);
                    // 触发开发者绑定的事件
                    if (onKeyDown) onKeyDown(e);
                },
                onMouseDown: (e: MouseEvent) => {
                    // e.persist();
                    handlePress(handleIndex);
                    // 触发开发者绑定的事件
                    if (onMouseDown) onMouseDown(e);
                },
                // 'onTouchStart': (e) => {
                //     e.persist();
                //     handlePress(e, i);
                //     if (onTouchStart) onTouchStart(e);
                // },
                // 无障碍配置
                // 'role': 'slider',
                // 'aria-valuemin': min,
                // 'aria-valuemax': max,
                // 'aria-valuenow': value,
                style: {
                    position: 'absolute',
                    top: '50%',
                    left: `${getPercentageForValue(value)}%`,
                    zIndex: handleIndex === activeHandleIndex ? 1 : 0,
                    transform: 'translate(-50%, -50%)',
                    ...style,
                } as const,
                ...rest,
            }),
        })),
        [
            activeHandleIndex,
            getPercentageForValue,
            handleKeyDown,
            handlePress,
            tempValues,
            values,
        ],
    );

    const getTrackProps = ({ style = {}, /* ref, */ ...rest } = {}) => ({
        ref: (el: Element | null) => {
            if (!el) {
                return;
            }
            trackElRef.current = el;
            // if (ref) {
            //     if (typeof ref === 'function') {
            //         ref(el);
            //     }
            //     else {
            //         ref.current = el;
            //     }
            // }
        },
        style: {
            // position: 'relative',
            // userSelect: 'none',
            ...style,
        },
        ...rest,
    });

    return {
        activeHandleIndex,
        getTrackProps,
        ticks: buildTicks,
        segments,
        handles,
    };
}
